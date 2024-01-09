'use client';
import { insert, update, getRecords, getTotal, getRecord, 
    remove, removeRecords, preprocessor} from '../../objects/DatabaseInterface';
import { BrowserInfo, fm } from '../../objects/FormManager';
import { Model } from '../../objects/Model';
/**
 * Community record
 */
export type Record = {
    id: string,
    name: string,
    description: string,
    status: string,
    created_by: string,
    created_at: string,
    updated_by: string,
    updated_at: string,
    resource_community_id : string,
    resource_community: {name:''}
}

export class CollectionModel extends Model {
    browserName: string = 'collections';
    schema: string = 'resource_schema';
    table: string = 'resource_collection';

    /**
     * init record for insert
     */
    initRecord():Record {
        return {
            id:'',
            name: '',
            description: '',
            status: '',
            created_by: '',
            created_at: '',
            updated_by:'',
            updated_at: '',
            resource_community_id: '',
            resource_community:{name:''}
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
            ['id','name','description','status','created_at','created_by',
              'updated_at','updated_by',  
              'user_creator.username_public', 'user_modifier.username_public',
              'resource_community_id', 'resource_community.name' ], 
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
            ['id','name','description','status','created_at',
              'user_creator.username_public', 'user_modifier.username_public',
              'resource_community.name' ], 
            [browserInfo.order], 
            browserInfo.filter,
            browserInfo.offset,
            browserInfo.limit);
    }

    /**
     * @param id delete collection record and all childrens
     * @returns JSON promise
     */
    async delete(id:string)  {
        /*
        const rm = new ResourceModel();

        // get childrens, wait execute
        let res = await getRecords(this.schema, 'resource',
                ['id'],     // columns
                ['id:asc'], // order
                [{operator:'',
                  relation:{
                    field:'resource_collection_id',
                    relType:'eq',
                    value:id
                  }
                }],
                0, // offset
                0  // limti
        );
        res = preprocessor(res);
        let key = '';
        for (key in res) {
            // delete childrens, wait execute
            await rm.delete(res[key].id);
        }
        */        
        // delete labels of collection not wait execure
        removeRecords(this.schema, 'table_labels',
                [{operator:'',
                relation:{
                field:'parent_id',
                relType:'eq',
                value:id
                }
                }]
        )
        // delete collection record, return promise
        return remove(this.schema, this.table, id);
   }    

}    
