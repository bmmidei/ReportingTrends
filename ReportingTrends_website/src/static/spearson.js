(function (exports) {
  "use strict";

  var sort, round, min, max, range, sum, median, mean, deviation, variance, standardDeviation, standardize,
    rank, correlation, distance, pairwiseDistance, hierarchicalClustering;

  // @param {[number]} x Array of numbers.
  exports.sort = sort = function (x) {
    var copy;
    // Copy array.
    copy = x.slice();
    return copy.sort(function (a, b) {
      return a - b;
    });
  };

  // @param {number} x Number to round.
  // @param {number} [n] Number of decimal places.
  exports.round = round = function (x, n) {
    n = typeof n === "number" ? n : 0;
    return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
  };

  // @param {[number]} x Array of numbers.
  exports.min = min = function (x) {
    var min, i, n;
    min = Infinity;
    for (i = 0, n = x.length; i < n; i++) {
      if (x[i] < min) {
        min = x[i];
      }
    }
    return min;
  };

  // @param {[number]} x Array of numbers.
  exports.max = max = function (x) {
    var max, i, n;
    max = -Infinity;
    for (i = 0, n = x.length; i < n; i++) {
      if (x[i] > max) {
        max = x[i];
      }
    }
    return max;
  };

  // @param {number} start Start value.
  // @param {number} stop Stop value.
  exports.range = range = function (start, stop) {
    var len, range, idx;
    len = stop - start;
    range = new Array(len);
    for (idx = 0; idx < len; idx++) {
      range[idx] = start++;
    }
    return range;
  };

  // @param {[number]} x Array of numbers.
  exports.sum = sum = function (x) {
    var sum, i, n;
    sum = 0;
    for (i = 0, n = x.length; i < n; i++) {
      sum += x[i];
    }
    return sum;
  };

  // @param {[number]} x Array of numbers.
  exports.median = median = function (x) {
    var sorted;
    if (x.length === 1) {
      return x[0];
    } else {
      sorted = sort(x);
      if (sorted.length % 2 === 0) {
        return mean([x[(sorted.length / 2) - 1], x[sorted.length / 2]]);
      } else {
        return x[Math.floor(sorted.length / 2)];
      }
    }
  };

  // @param {[number]} x Array of numbers.
  exports.mean = mean = function (x) {
    return sum(x) / x.length;
  };

  // @param {[number]} x Array of numbers.
  exports.deviation = deviation = function (x) {
    var xBar, n, d, i;
    xBar = mean(x);
    n = x.length;
    d = new Array(n);
    for (i = 0; i < n; i++) {
      d[i] = x[i] - xBar;
    }
    return d;
  };

  // Calculates the variance.
  // @param {[number]} x Array of numbers.
  // @param {boolean} [bias] If true, the biased sample variance is used.
  exports.variance = variance = function (x, bias) {
    var d, i, n;
    bias = typeof bias === "boolean" ? bias : false;
    d = deviation(x);
    n = d.length;
    for (i = 0; i < n; i++) {
      d[i] = Math.pow(d[i], 2);
    }
    return sum(d) / (n - (bias === false ? 1 : 0));
  };

  // Calculates the sample standard deviation.
  // @param {[number]} x Array of numbers.
  // @param {boolean} [bias] If true, the biased sample variance is used.
  exports.standardDeviation = standardDeviation = function (x, bias) {
    bias = typeof bias === "boolean" ? bias : false;
    return Math.sqrt(variance(x, bias));
  };

  // @param {[number]} x Array of numbers.
  exports.standardize = standardize = function (x) {
    var sd, d, i, n;
    sd = standardDeviation(x);
    d = deviation(x);
    for (i = 0, n = d.length; i < n; i++) {
      d[i] = d[i] / sd;
    }
    return d;
  };

  // Calculates the correlation coefficient for two variables.
  // @param {[number]} x Array of numbers.
  // @param {[number]} y Array of numbers.
  exports.correlation = correlation = {
    // @param {boolean} [standardize] If false, x and y will not be standardized.
    pearson: function (x, y, standardize) {
      var n, d, i;
      standardize = typeof standardize === "boolean" ? standardize : true;
      if (standardize === true) {
        x = exports.standardize(x);
        y = exports.standardize(y);
      }
      n = x.length;
      d = new Array(n);
      for (i = 0; i < n; i++) {
        d[i] = x[i] * y[i];
      }
      return sum(d) / (n - 1);
    },
    // @param {boolean} [rank] If false, x and y will not be ranked.
    spearman: function (x, y, rank) {
      var xDeviation, yDeviation;
      rank = typeof rank === "boolean" ? rank : true;
      if (rank === true) {
        x = exports.rank(x);
        y = exports.rank(y);
      }
      xDeviation = deviation(x);
      yDeviation = deviation(y);
      return sum(xDeviation.map(function (xi, i) {
        return xi * yDeviation[i];
      })) / Math.sqrt(sum(xDeviation.map(function (xi) {
        return Math.pow(xi, 2);
      })) * sum(yDeviation.map(function (yi) {
        return Math.pow(yi, 2);
      })));
    }
  };

}(typeof exports === "undefined" ? this.spearson = {} : exports));