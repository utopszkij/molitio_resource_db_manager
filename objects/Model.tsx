'use client';
import { insert, update, getRecords, getTotal, getRecord, 
    remove, removeRecords, preprocessor} from './DatabaseInterface';
import { BrowserInfo, fm } from './FormManager';

/**
* always transferable
*/
export type Record = {
    id: string,
    //name: string,
    //description: string,
    //status: string,
    created_by: string,
    created_at: string,
    updated_by: string,
    updated_at: string
}

export class Model {
    // always transferable:
    browserName: string = 'communities';
    schema: string = 'resource_schema';
    table: string = 'resource_community';

    /**
     * setup model
     */
    constructor() {
    }

    /**
     * init record for insert
     * always transferable
     */
    initRecord(): Record {
        return {
            id: '',
            //name: '',
            //description: '',
            //status: '',
            created_by: '',
            created_at: '',
            updated_by: '',
            updated_at: ''
        }
    }

    /**
     * read one record from database
     * @param id 
     * @returns JSON promise 
     *   afrer preprocessed      {error:'..'} |
     *                           [record]
     * always transferable
     */
    async getRecord(id: string) {
        return getRecord(this.schema, this.table,
            ['id','name','description','status','created_at','created_by',
              'updated_at','updated_by',  
              'user_creator.username_public', 'user_modifier.username_public' ], 
            id);  
    }

    /**
     * read records from database, use browserInfo
     * @param browserInfo 
     * @returns JSON promise
     *   afrer preprocessed     {error:'..'} |
     *                          [record]
     * always transferable
     */
    async getRecords(browserInfo: BrowserInfo) {
        return getRecords(this.schema, this.table,
            ['id','name','description','status','created_at',
              'user_creator.username_public', 'user_modifier.username_public' ], 
            [browserInfo.order], 
            browserInfo.filter,
            browserInfo.offset,
            browserInfo.limit);
    }

    /**
     * read total record count from database, use browserInfo.filter 
     * @param browserInfo 
     * @returns JSON promise
     *   afrer preprocessed     {error:'..'} |
     *                          {count:number}
     */
    async getTotal(browserInfo: BrowserInfo) {
        return getTotal(this.schema, this.table,
            browserInfo.filter);

    }

    /**
     * save one record (insert or update)
     * @param record 
     * @returns JSON promise
     *   afrer preprocessed    {error:'...'} |
     *                         {id:number} |
     *                         {affectedRows}
     */
    async save(record: any) {
        if (record.id == undefined)  {
            return insert(this.schema,this.table, record);
        } else {
            return update(this.schema, this.table, record.id, record);
        }    
    }

    /**
     * delete one record and childrens
     * @param id 
     * @returns JSON promise
     *     afrer preprocessed  {error:'...'} |
     *                         {affectedRows}
     * often to be rewritten
     */
    async delete(id: string) {
        // delete all childrens wait exeution

        // delete table_labls not wait execution

        // return record
        return remove(this.schema,this.table, id);
    }

}    
