String.prototype.isEmpty = function () {
    return (this.length === 0 || !this.trim());
};

String.prototype.trunc = String.prototype.trunc ||
    function (n) {
        return (this.length > n) ? this.substr(0, n - 1) + '...' : this;
    };