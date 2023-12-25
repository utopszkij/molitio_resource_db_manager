'use client';

export const Paginator = {
    pSize: -1,
    /**
     * Buld Pages array from paginator display 
     * @param count 
     * @param limit 
     * @returns 
     */
    buildPages: (count:number, limit:number ):Array<number> => {
        let result:Array<number> = [];
        let w = 0;
        while (w < count) {
            result.push(w);
            w = w + limit;
        }
        return result;
    },

    /**
     * should the "pOffset" paginator button be displayed?
     * @param actOffset 
     * @param limit 
     * @param pOffset 
     * @returns 
     */
    visiblePaginator: (actOffset: number, limit: number, pIndex: number): boolean => {
        let result = false;
        let pOffset = pIndex*limit;
        if (Paginator.pSize < 0) {
            Paginator.pSize = (window?.innerWidth - 200) / 60;
        }
        if ((pOffset >= (actOffset - Paginator.pSize*limit)) &&
            (pOffset <= (actOffset + Paginator.pSize*limit)) &&
            (pOffset != actOffset)) {
            result = true;
        }    
        return result;
    }

}