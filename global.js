module.exports = {
    isNum: function(val) {
        {
            if (isNaN(val))
                return console.log('Please enter a valid Product ID number');
            return true;
        }
    },
    findItem: function(source, target) {
        for (let i = 0; i < source.length; i++) {
            if (source[i].item_id == target.item_id) {
                return source[i];
            }
        }
    }
};
