'use client';
import { insert, update, getRecords, getTotal, getRecord, 
    remove, removeRecords, preprocessor} from '../../objects/DatabaseInterface';
import { BrowserInfo, fm } from '../../objects/FormManager';
import { Model } from '../../objects/Model';
/**
 * LabelType record
 */
export type Record = {
    id: string,
    type_name: string,
    unit: string,
    created_by: string,
    created_at: string,
    updated_by: string,
    updated_at: string
}

export class LabelTypeModel extends Model {
    browserName: string = 'lebelTypes';
    schema: string = 'resource_schema';
    table: string = 'resource_label_type';


    /**
     * init record for insert
     */
    initRecord():Record {
        return {
            id: '',
            type_name: '',
            unit: '',
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
     */
    async getRecord(id: string) {
        return getRecord(this.schema, this.table,
            ['id','type_name','unit','created_at','created_by',
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
     */
    async getRecords(browserInfo: BrowserInfo) {
        return getRecords(this.schema, this.table,
            ['id','type_name','unit','created_at',
              'user_creator.username_public', 'user_modifier.username_public' ], 
            [browserInfo.order], 
            browserInfo.filter,
            browserInfo.offset,
            browserInfo.limit);
    }

    /**
     * @param id delete community record and all childrens
     * @returns JSON promise
     */
    async delete(id:string)  {
        // delete resource_label_type record, return promise
        return remove(this.schema, this.table, id);
   }    
}