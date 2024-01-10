import '@testing-library/jest-dom';
import { LabelController, FormData } from '../components/Labels/LabelsController';
import { setFetchResults } from '../objects/Mock';

var formData: FormData = {
    compStatus: '',
    // messages
    errorMsg: '',
    successMsg: '',
    // data form
    parentName: '',
    id: '',
    value: '',
    resource_label_type_id: '',
    created_by: '',
    creatorName: '',
    created_at: '',
    updated_by: '',
    updaterName: '',
    updated_at: '',
    labelTypes:[],
    // filter form
    filterTypeName: '',
    // browser
    offset:0,
    order:'',
    total:0,
    items: [],
    pages: []
}
const getFormData = ():FormData => {
    return formData;
}
const setFormDataField = (fname: string, value: any):void => {
    if (fname == 'compStatus') formData.compStatus = value;
    if (fname == 'errorMsg') formData.errorMsg = value;
    if (fname == 'successMsg') formData.successMsg = value;
    if (fname == 'id') formData.id = value;
    if (fname == 'created_by') formData.created_by = value;
    if (fname == 'creatorName') formData.creatorName = value;
    if (fname == 'created_at') formData.created_at = value;
    if (fname == 'updated_by') formData.updated_by = value;
    if (fname == 'updaterName') formData.updaterName = value;
    if (fname == 'updated_at') formData.updated_at = value;
    if (fname == 'offset') formData.offset = value;
    if (fname == 'order') formData.order = value;
    if (fname == 'total') formData.total = value;
    if (fname == 'items') formData.items = value;
    if (fname == 'pages') formData.pages = value;
}

describe("LabelController test", () => {
    const controller = new LabelController();
    const wait = 500; // ms wait for asnc process

    test('LabelController onLoad id=="0"', () => {
        controller.id = '0';
        let record = {
            id:'123', 
            name: 'name123',
            description:'',
            status:'',
            created_by:'',
            created_at:'',
            updated_by:'',
            updated_at:'', 
            user_creator: {username_public: ''},
            user_modifier: {username_public: ''}
         }    
        setFetchResults([
            { data:{ table:[record]} }, // parent table
            { data:{ table:[record]} }, // labelTypes
            { data:{ table:[record]} }, // table_labels
            { data:{ table:{agregate:{count:1}}} }
        ]);
        controller.onLoad('0', setFormDataField, getFormData);
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          
    });    
    test('LabelController onLoad id!="0"', () => {
        controller.id = '1';
        let record = {
            id:'123', 
            name: 'name123',
            description:'',
            status:'',
            created_by:'',
            created_at:'',
            updated_by:'',
            updated_at:'', 
            user_creator: {username_public: ''},
            user_modifier: {username_public: ''}
         }    
        setFetchResults([
            { data:{ table:[record]} }, // parent table
            { data:{ table:[record]} }, // labelTypes
            { data:{ table:[record]} }
        ]);
        controller.onLoad('1', setFormDataField, getFormData);
        setTimeout( () => {
            expect(formData.compStatus).toBe('show');
        }, wait);          
    });    
    test('LabelController getOneRecord OK test', () => {
        let record = {
            id:'123', 
            name: 'name123',
            description:'',
            status:'',
            created_by:'',
            created_at:'',
            updated_by:'',
            updated_at:'', 
            user_creator: {username_public: ''},
            user_modifier: {username_public: ''}
         }    
         setFetchResults([
             { data:{ table:[record]} }
         ]);
         controller.getOneRecord('123','show');
        setTimeout( () => {
            expect(formData.compStatus).toBe('show');
            expect(formData.errorMsg).toBe('');
        }, wait);          
    });
    test('LabelController getOneRecord notfound test', () => {
        setFetchResults([
            { errors:[ {message:'notFound'} ] }
        ]);
        controller.getOneRecord('999','show');
        setTimeout( () => {
            expect(formData.errorMsg).toBe('notFound');
        }, wait);          
    });
    test('LabelController new test', () => {
        controller.new();
        expect(formData.compStatus).toBe('edit');
        expect(formData.created_by).toBe(controller.user.id);
    });
    test('LabelController doFilter test OK', () => {
        let record = {
            id:'123', 
            name: 'name123',
            description:'',
            status:'',
            created_by:'',
            created_at:'',
            updated_by:'',
            updated_at:'', 
            user_creator: {username_public: ''},
            user_modifier: {username_public: ''}
         }    
         setFetchResults([
             { data:{ table:[record]} },
             { data:{ table:{agregate:{count:1}}} }
         ]);
        controller.doFilter();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
            expect(formData.total).toBe(1);
        }, wait);          
    });
    test('LabelController doFilter test notFound', () => {
       setFetchResults([
            { data:{ table:[]} },
            { data:{ table:{agregate:{count:0}}} }
       ]);
       controller.doFilter();
       setTimeout( () => {
           expect(formData.compStatus).toBe('browser');
           expect(formData.total).toBe(0);
       }, wait);          
   });
   test('LabelController delFilter test', () => {
        setFetchResults([
            { data:{ table:[]} },
            { data:{ table:{agregate:{count:0}}} }
        ]);
        controller.delFilter();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          
    });
    test('LabelController validator test ok', () => {
        formData.resource_label_type_id = '123';
        let res = controller.validator();
        expect(res).toBe('');
    });
    test('LabelController validator test notok', () => {
        formData.resource_label_type_id = '';
        let res = controller.validator();
        expect(res.indexOf('TYPE_REQUIRED')).toBeGreaterThanOrEqual(0);
    });
    test('LabelController save test insert OK', () => {
        formData.id = '';
        formData.resource_label_type_id = '123';
        controller.save();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
            expect(formData.errorMsg).toBe('');
            expect(formData.successMsg).toBe('SAVED');
        }, wait);          
    });
    test('LabelController save test update OK', () => {
        formData.id = '123';
        formData.resource_label_type_id = '123';
        formData.created_at = '200-01-01';
        formData.created_by = '111';
        formData.compStatus = 'edit';
        controller.save();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
            expect(formData.errorMsg).toBe('');
            expect(formData.successMsg).toBe('SAVED');
        }, wait);          
    });
    test('LabelController save test update not valid', () => {
        formData.id = '123';
        formData.resource_label_type_id = '';
        formData.created_at = '200-01-01';
        formData.created_by = '111';
        controller.save();
        setTimeout( () => {
            expect(formData.compStatus).toBe('edit');
            expect(formData.errorMsg.indexOf('TYPE_REQUIRED')).toBeGreaterThanOrEqual(0);
            expect(formData.successMsg).toBe('');
        }, wait);          
    });
    test('LabelController doDelete test', () => {
        controller.doDelete('123');
        setFetchResults([
            { data:{ table:[]} },  // childrens
            { data:[{ affected_rows: 0} ]}, // delete labels
            { data:[{ affected_rows: 0} ]}  // delete record
        ]);
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          

    });    

});

