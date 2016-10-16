/**
     * [SortChannels sort channels by order of type then primary on top and in case of equal channels decide on label]
     * @param {[type]} mapping [description]
     */
    function SortChannels(mapping) {
        var orderByArr = mapping.orderBy || [];
        return function(a, b) {
            var result = 0;
            var indexA = (orderByArr.indexOf(a['type']) >=0 ? orderByArr.indexOf(a['type']) : 200);
            var indexB = (orderByArr.indexOf(b['type'])>=0 ? orderByArr.indexOf(b['type']): 200);
            result = (indexA < indexB) ? -1 : (indexA > indexB) ? 1 : 0;    
            if(a['name'].indexOf(mapping.primary[0]) >=0){
                result = -1;
            }
            if(result === 0){
                result = (a['label'] < b['label']) ? -1 : (a['label'] > b['label']) ? 1 : 0;    
            }
            return result;
        }
    }