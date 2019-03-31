import get from "lodash/get";
import { key_utils } from "./auth/ecc";

module.exports = bearsAPI => {
  function numberWithCommas(x) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function coiningBears(account, gprops) {
    const coins = parseFloat(account.coining_shares.split(" ")[0]);
    const total_coins = parseFloat(gprops.total_coining_shares.split(" ")[0]);
    const total_coin_bears = parseFloat(
      gprops.total_coining_fund_bears.split(" ")[0]
    );
    const coining_bearsf = total_coin_bears * (coins / total_coins);
    return coining_bearsf;
  }

  function processOrders(open_orders, assetPrecision) {
    const bsdOrders = !open_orders
      ? 0
      : open_orders.reduce((o, order) => {
          if (order.sell_price.base.indexOf("BSD") !== -1) {
            o += order.for_sale;
          }
          return o;
        }, 0) / assetPrecision;

    const bearsOrders = !open_orders
      ? 0
      : open_orders.reduce((o, order) => {
          if (order.sell_price.base.indexOf("BEARS") !== -1) {
            o += order.for_sale;
          }
          return o;
        }, 0) / assetPrecision;

    return { bearsOrders, bsdOrders };
  }

  function calculateSaving(savings_withdraws) {
    let savings_pending = 0;
    let savings_bsd_pending = 0;
    savings_withdraws.forEach(withdraw => {
      const [amount, asset] = withdraw.amount.split(" ");
      if (asset === "BEARS") savings_pending += parseFloat(amount);
      else {
        if (asset === "BSD") savings_bsd_pending += parseFloat(amount);
      }
    });
    return { savings_pending, savings_bsd_pending };
  }

  function pricePerBears(feed_price) {
    let price_per_bears = undefined;
    const { base, quote } = feed_price;
    if (/ BSD$/.test(base) && / BEARS$/.test(quote)) {
      price_per_bears = parseFloat(base.split(" ")[0]) / parseFloat(quote.split(" ")[0]);
    }
    return price_per_bears;
  }

  function estimateAccountValue(
    account,
    { gprops, feed_price, open_orders, savings_withdraws, coining_bears } = {}
  ) {
    const promises = [];
    const username = account.name;
    const assetPrecision = 1000;
    let orders, savings;

    if (!coining_bears || !feed_price) {
      if (!gprops || !feed_price) {
        promises.push(
          bearsAPI.getStateAsync(`/@${username}`).then(data => {
            gprops = data.props;
            feed_price = data.feed_price;
            coining_bears = coiningBears(account, gprops);
          })
        );
      } else {
        coining_bears = coiningBears(account, gprops);
      }
    }

    if (!open_orders) {
      promises.push(
        bearsAPI.getOpenOrdersAsync(username).then(open_orders => {
          orders = processOrders(open_orders, assetPrecision);
        })
      );
    } else {
      orders = processOrders(open_orders, assetPrecision);
    }

    if (!savings_withdraws) {
      promises.push(
        bearsAPI
          .getSavingsWithdrawFromAsync(username)
          .then(savings_withdraws => {
            savings = calculateSaving(savings_withdraws);
          })
      );
    } else {
      savings = calculateSaving(savings_withdraws);
    }

    return Promise.all(promises).then(() => {
      let price_per_bears = pricePerBears(feed_price);

      const savings_balance = account.savings_balance;
      const savings_bsd_balance = account.savings_bsd_balance;
      const balance_bears = parseFloat(account.balance.split(" ")[0]);
      const saving_balance_bears = parseFloat(savings_balance.split(" ")[0]);
      const bsd_balance = parseFloat(account.bsd_balance);
      const bsd_balance_savings = parseFloat(savings_bsd_balance.split(" ")[0]);

      let conversionValue = 0;
      const currentTime = new Date().getTime();
      (account.other_history || []).reduce((out, item) => {
        if (get(item, [1, "op", 0], "") !== "convert") return out;

        const timestamp = new Date(get(item, [1, "timestamp"])).getTime();
        const finishTime = timestamp + 86400000 * 3.5; // add 3.5day conversion delay
        if (finishTime < currentTime) return out;

        const amount = parseFloat(
          get(item, [1, "op", 1, "amount"]).replace(" BSD", "")
        );
        conversionValue += amount;
      }, []);

      const total_bsd =
        bsd_balance +
        bsd_balance_savings +
        savings.savings_bsd_pending +
        orders.bsdOrders +
        conversionValue;

      const total_bears =
        coining_bears +
        balance_bears +
        saving_balance_bears +
        savings.savings_pending +
        orders.bearsOrders;

      return (total_bears * price_per_bears + total_bsd).toFixed(2);
    });
  }

  function createSuggestedPassword() {
    const PASSWORD_LENGTH = 32;
    const privateKey = key_utils.get_random_key();
    return privateKey.toWif().substring(3, 3 + PASSWORD_LENGTH);
  }

  return {
    reputation: function(reputation) {
      if (reputation == null) return reputation;
      reputation = parseInt(reputation);
      let rep = String(reputation);
      const neg = rep.charAt(0) === "-";
      rep = neg ? rep.substring(1) : rep;
      const str = rep;
      const leadingDigits = parseInt(str.substring(0, 4));
      const log = Math.log(leadingDigits) / Math.log(10);
      const n = str.length - 1;
      let out = n + (log - parseInt(log));
      if (isNaN(out)) out = 0;
      out = Math.max(out - 9, 0);
      out = (neg ? -1 : 1) * out;
      out = out * 9 + 25;
      out = parseInt(out);
      return out;
    },

    coinToBears: function(
      coiningShares,
      totalCoiningShares,
      totalCoiningFundBears
    ) {
      return (
        parseFloat(totalCoiningFundBears) *
        (parseFloat(coiningShares) / parseFloat(totalCoiningShares))
      );
    },

    commentPermlink: function(parentAuthor, parentPermlink) {
      const timeStr = new Date()
        .toISOString()
        .replace(/[^a-zA-Z0-9]+/g, "")
        .toLowerCase();
      parentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, "");
      return "re-" + parentAuthor + "-" + parentPermlink + "-" + timeStr;
    },

    amount: function(amount, asset) {
      return amount.toFixed(3) + " " + asset;
    },
    numberWithCommas,
    coiningBears,
    estimateAccountValue,
    createSuggestedPassword,
    pricePerBears
  };
};
