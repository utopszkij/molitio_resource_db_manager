/**
 * Database interface for Hasura
 * =============================
 * 
 * Must all table primaty key name is "id"
 * "fieldName" , "schema_table.fieldName" enabled in columns name, filter, order parameters.
 * (where "schema_table" a relationship name in hasura)
 * 
 * WARNING! must send promisse check information to hasura in this fetchGraphQL function!
 * 
 * The all exported async funtion result a promisser, 
 * typycal result process function:
 * 
 *   (res) => { res=preprocessor(res)
 *              if (res.error) {
 *                   ......
 *              } else {
 *                ......
 *              }
 *            }
 * 
 * example insert preprocessed result: 
 *   { "id": "33131bb8-39a4-454b-8081-2180ca3111dc"}
 * 
 * example get records preproccessed result:
 *     [
 *       { record },
 *       } record }....
 *     ]
 * 
 * example preprocessed error result
 * {"error": "........"}
 * 
 * Author: Fogler Tibor (Utopszkij)  tibor.fogler@gmail.com
 * Licence: GNU/GPL
 */

const hasuraURL = 'http://localhost:8080/v1/graphql';
type Schema = 'public_user_schema'|
              'private_user_schema'|
              'resource_schema';
type Table = 'user_public' |
             'user_private' | 
             'user_identity' |
             'user_persisted_config' |
             'public_resource_community' |
             'private_resource_community' |
             'resource_community' |
             'resource_collection' |
             'resource' |
             'resource_label_type' |
             'resorce_label' |
             'resource_collection_label' |
             'resource_community_label';     
             
/*
  must define relationship in hasura:
    user_creator     .created_by --> user_public
    user_modifier    .updated_by --> user_public
*/
// ==================================================================================

type FieldName = string | `${Schema}_${Table}.${string}`;
type Operator = ''|'and'|'or'|'not';
type RelType = 'eq'|'neq'|'lt'|'lte'|'gt'|'gte'|'like'|'regex'|'is_null';
type Relation = {
  field: FieldName,
  relType: RelType,
  value: any
}
type RelationItem = {
  operator: Operator,
  relation?: Relation,    // there is realtion xor relations
  relations?: Relations
}
type Relations = Array<RelationItem>;
type ColumnsArray = Array<FieldName>;  
type OrderItem = string; // "name: asc"| "name: desc" 
type OrderArray = Array<OrderItem>; 

/**
 * send mutation or query to Hasura 
 * @param operationsDoc 
 * @param operationName 
 * @param variables 
 * @return JSON Promise 
 */
async function fetchGraphQL(operationsDoc: string, operationName: string , variables: object) {
    // this is the here the put promisse check info for hasura into http query header! 
    let res = await fetch(
        hasuraURL,
        {
          method: "POST",
          body: JSON.stringify({
              query: operationsDoc,
              variables: variables,
              operationName: operationName
          })
    })
    return res.json();
}

/**
 * send mutation from hasura
 * @param operationsDoc 
 * @param graphQName 
 * @return Json Promise 
 */
function executeMyMutation(operationsDoc: string, graphQName: string) {
  //console.log(operationsDoc);
  return fetchGraphQL(
      operationsDoc,
      graphQName,
      {}
    );
}

/**
 * send query fetch from Hasura
 * @param operationsDoc 
 * @param graphQName 
 * @return Json Promise 
 */
function fetchMyQuery(operationsDoc: string, graphQName: string) {
  //console.log(operationsDoc);
  return fetchGraphQL(
        operationsDoc, 
        graphQName, 
        {});
}

/**
 * 
 * @param obj modiied JSON.stringify for hasura specialities
 * @return string 
 */
function JSONStringify(obj:object): string {
  let s = JSON.stringify(obj);
  s = s.replaceAll('{"','{');
  s = s.replaceAll('":',':');
  s = s.replaceAll(', "',', ');
  s = s.replaceAll(',"',',');
  return s;
}

/**
 * database interface insert one record
 * @param schema 
 * @param table 
 * @param record 
 * @return JSON promise 
 */
export function insert(schema: string, table: string, record:object) {
    const graphQName = schema+'_'+table+'_insert';
    const operationsDoc = `mutation `+graphQName+` {
      insert_`+schema+`_`+table+`_one(object: `+JSONStringify(record)+`) {
        id
      }
    }
    `;
    return executeMyMutation(operationsDoc, graphQName);
}

/**
 * database interface update one record
 * @param schema 
 * @param table 
 * @param pk 
 * @param record 
 * @return Json promise
 */
export async function update(schema: string, table: string, id:string, record:object) {
    const graphQName = schema+'_'+table+'_update';
    const operationsDoc = `
        mutation `+graphQName+` {
        update_`+schema+`_`+table+`_by_pk(pk_columns: {id: "`+id+`"}, 
        _set: `+JSONStringify(record)+`)
        { id }
        }
    `;    
  return executeMyMutation(operationsDoc, graphQName);
}

/**
 * database interface update muétiply records
 * @param schema 
 * @param table 
 * @param pk 
 * @param record 
 * @return Json promise
 */
export async function updateRecords(schema: string, table: string, filter:Relations, record:object) {
  const graphQName = schema+'_'+table+'_update';
  const operationsDoc = `
  mutation `+graphQName+` {
    update_`+schema+`_`+table+`(where:`+buildWhereStr(filter)+`,
    _set: `+JSONStringify(record)+`) {  
      affected_rows
    }
  }    
  `;    
return executeMyMutation(operationsDoc, graphQName);
}


/**
 * database interface delete one record
 * @param schema 
 * @param table 
 * @param pk 
 * @return Json promise
 */
export async function remove(schema: string, table: string, id:string) {
  const graphQName = schema+'_'+table+'_delete';
  const operationsDoc = `
      mutation `+graphQName+` {
      delete_`+schema+`_`+table+`(where:{id: {_eq: "`+id+`"}}) {
        affected_rows
      }
      }    
  `;   
  return executeMyMutation(operationsDoc, graphQName);
}

/**
 * remove multiply records
 * @param schema 
 * @param table 
 * @param filter 
 * @return json promise 
 */
export async function removeRecords(schema:string, table:string, filter:Relations) {
  const graphQName = schema+'_'+table+'_delete';
    const operationsDoc = `
        mutation `+graphQName+` {
        delete_`+schema+`_`+table+`(where:`+buildWhereStr(filter)+`) {
          affected_rows
        }
        }    
    `;   
    return executeMyMutation(operationsDoc, graphQName);
}

/**
 * adjust value to string for hasura where 
 * @param value 
 * @return string 
 */
function adjustValue(value:any):string {
  let result:string  = String(value);
  if (typeof value === "string") {
    result = '"'+value+'"';
  }
  return result;
}

/**
 * build filter str for Hasura operationDoc
 * @param filter 
 * @return string 
 */
function buildWhereStr(filter?: Relations): string {
    let result = '{';
    if (filter != undefined) {
      let i = 0;
      for (i=0; i<filter.length; i++) {
          if (i>0) { 
            result += ', \n'; 
          }
          if ((filter[i].operator == 'or') || (filter[i].operator == 'not')) {
              result += '_'+filter[i].operator+': {\n';
          }  
          if (filter[i].relations != undefined) {
                result += buildWhereStr(filter[i].relations);
          }
          if (filter[i].relation != undefined) {
              let fieldName = ''+filter[i].relation?.field;
              let value = adjustValue(filter[i].relation?.value);
              if (fieldName.indexOf('.') > 0) {
                // field from relationshiped table
                let w = fieldName.split('.');
                result += w[0]+': {'+filter[i].relation?.field+
                ': {_'+filter[i].relation?.relType+': '+value+'}}';

              } else {
                // field from queried table
                result += filter[i].relation?.field+
                ': {_'+filter[i].relation?.relType+': '+value+'}';
              }  
          }    
          if ((filter[i].operator == 'or') || (filter[i].operator == 'not')) {
              result += '}';
          }  
      }    
    }
    result += '}';
    return result;
}

/**
 * buid columns str for Hasura operationsDoc
 * @param columns [ fielName  | relationTable:{ fieldName}, ... ]
 * @return string 
 */
function buildColumnsStr(columns: ColumnsArray): string {
    let result = '';
    let i = 0;
    for (i=0; i<columns.length; i++) {
        if (i>0) result += ' ';
        if (columns[i].indexOf('.') >= 0) {
            columns[i] = columns[i].replace('.','{')+'}';
        }
        result += columns[i];
    }
    return result;
}

/**
 * build order str for Hasura operationsDoc
 * @param orders [ fielName: asc|des  | relationTable:{ fieldName: asc|desc}, ... ]
 * @return string 
 */
function buildOrdersStr(orders: OrderArray): string {
    let result = '{';
    let i = 0;
    for (i=0; i<orders.length; i++) {
        if (i>0) result += ',  ';
        if (orders[i].indexOf(':') < 0) {
          orders[i] = orders[i].replace(' ',': ');
        }  
        if (orders[i].indexOf('.') >= 0) {
          result += String(orders[i]).replace('.',': {')+'}';
        } else {
            result += orders[i];
        }    
    }
    return result+'}';
}

/**
 * 
 * @param res hasura result preprocessor
 * @returns 
 */
export function preprocessor(res:any) {
  let item:any;
  if (res.errors != undefined ) {
    let msg = '';
    let i = 0;
    for (i=0; i < res.errors.length; i++) {
      msg += ','+res.errors[i].message;
    }
    return {error: msg.substring(1,500)};
  }
  for (item in res.data) {
    if (res.data[item].aggregate != undefined) {
      return res.data[item].aggregate;
    } else {
      return res.data[item];
    }
  }
}

/**
 * get record set 
 * @param schema 
 * @param table 
 * @param order 
 * @param filter 
 * @param offset 
 * @param limit 
 * @returm json promise {data: {schema_table:[{record},...] }}
 */
export async function getRecords(schema: string, table: string,
    columns: ColumnsArray, 
    orders?: OrderArray, 
    filter?: Relations,
    offset?: number,
    limit?: number ) {
    if (filter == undefined) filter = [];        
    if (offset == undefined) offset = 0;
    if (limit == undefined) limit = 10;        
    if (orders == undefined) orders = ['id: asc'];        
    const graphQName = schema+'_'+table;
    const whereStr = buildWhereStr(filter);
    const columnsStr = buildColumnsStr(columns);
    const ordersStr = buildOrdersStr(orders);
    let limitStr ='';
    if (limit == 0) {
      limitStr = '';
    } else {
      limitStr = 'limit: '+limit+',';
    }
    const operationsDoc = `
    query `+graphQName+` {
        `+schema+`_`+table+`(`+limitStr+` 
                             offset: `+offset+`, 
                             order_by: `+ordersStr+`,
                             where: `+whereStr+`
                            )
        {
        `+columnsStr+`    
        }
    }    
    `; 
    return fetchMyQuery(operationsDoc, graphQName);

}

/**
 * get record set count 
 * @param schema 
 * @param table 
 * @param filter 
 * @returm json promise  {data:{ resource_table_aggregate: { aggregate:{count:number}}}} 
 */
export async function getTotal(schema: string, table: string,
    filter: Relations) {
    const graphQName = schema+'_'+table+'_getTotal';
    const whereStr = buildWhereStr(filter);
    const operationsDoc = `
    query `+graphQName+` {
        `+schema+`_`+table+`_aggregate(where: `+whereStr+`) {
        aggregate {
          count(columns: id)
        }    
      }
    }    
    `;     
    return fetchMyQuery(operationsDoc, graphQName);

}

/**
 * get one record by id
 * @param schema 
 * @param table 
 * @param columns
 * @param id 
 * @return Json promise
 */
export async function getRecord(schema: string, table: string, 
    columns: ColumnsArray, id: string) {
    return getRecords(schema, table, columns,
         ['id: asc'],
         [{
            operator: '',
            relation: {
              field: 'id',
              relType: 'eq',
              value: id
            }  
          }
         ]);    
}

