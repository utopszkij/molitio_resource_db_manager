'use client';
import { insert, update, getRecords, getTotal, getRecord, 
    remove, removeRecords, preprocessor} from '../../objects/DatabaseInterface';
import { BrowserInfo, fm } from '../../objects/FormManager';
import { Model } from '../../objects/Model';
/**
 * Label record
 */
export type Record = {
    id: string,
    created_by: string,
    created_at: string,
    updated_by: string,
    updated_at: string,
    parent_table: string,
    parent_id: string,
    resource_label_type_id: string,
    value: string,
    resource_label_type: {type_name:string, unit: string}
}

export class LabelModel extends Model {
    browserName: string = 'lebels';
    schema: string = 'resource_schema';
    table: string = 'table_label';


    /**
     * init record for insert
     */
    initRecord():Record {
        return {
            id: '',
            created_by: '',
            created_at: '',
            updated_by: '',
            updated_at: '',
            parent_table: '',
            parent_id : '',
            resource_label_type_id: '',
            value: '',
            resource_label_type: {type_name:'',unit:''}
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
            ['id','parent_table', 'parent_id', 'resource_label_type_id', 'value',
             'created_at','created_by', 'updated_at','updated_by',  
             'user_creator.username_public', 'user_modifier.username_public',
             'resource_label_type.type_name', 'resource_label_type.unit'], 
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
            ['id','parent_table', 'parent_id', 'resource_label_type_id', 'value',
              'created_at', 'user_creator.username_public', 'user_modifier.username_public',
             'resource_label_type.type_name', 'resource_label_type.unit' ], 
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