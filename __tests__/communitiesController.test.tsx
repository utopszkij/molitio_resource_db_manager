import '@testing-library/jest-dom';
import { CommunityController, FormData } from '../components/Communities/CommunitiesController';
import { setFetchResults } from '../objects/Mock';

var formData: FormData = {
    compStatus: '',
    // messages
    errorMsg: '',
    successMsg: '',
    // data form
    id: '',
    name: '',
    description: '',
    status: '',
    created_by: '',
    creatorName: '',
    created_at: '',
    updated_by: '',
    updaterName: '',
    updated_at: '',
    // filter form
    filterName: '',
    filterDescription: '',
    filterStatus: '',
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
    if (fname == 'name') formData.name = value;
    if (fname == 'description') formData.description = value;
    if (fname == 'status') formData.status = value;
    if (fname == 'created_by') formData.created_by = value;
    if (fname == 'creatorName') formData.creatorName = value;
    if (fname == 'created_at') formData.created_at = value;
    if (fname == 'updated_by') formData.updated_by = value;
    if (fname == 'updaterName') formData.updaterName = value;
    if (fname == 'updated_at') formData.updated_at = value;
    if (fname == 'filterName') formData.filterName = value;
    if (fname == 'filterDescription') formData.filterDescription = value;
    if (fname == 'filterStatus') formData.filterStatus = value;
    if (fname == 'offset') formData.offset = value;
    if (fname == 'order') formData.order = value;
    if (fname == 'total') formData.total = value;
    if (fname == 'items') formData.items = value;
    if (fname == 'pages') formData.pages = value;
}

describe("CommunityController test", () => {
    const controller = new CommunityController();
    const wait = 500; // ms wait for asnc process

    test('communitiesController onLoad id=="0"', () => {
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
            { data:{ table:[record]} },
            { data:{ table:{agregate:{count:1}}} }
        ]);
        controller.onLoad('0', setFormDataField, getFormData);
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          
    });    
    test('communitiesController onLoad id!="0"', () => {
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
            { data:{ table:[record]} }
        ]);
        controller.onLoad('1', setFormDataField, getFormData);
        setTimeout( () => {
            expect(formData.compStatus).toBe('show');
        }, wait);          
    });    
    test('communitiesController getOneRecord OK test', () => {
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
            expect(formData.name).toBe('name123');
        }, wait);          
    });
    test('communitiesController getOneRecord notfound test', () => {
        setFetchResults([
            { errors:[ {message:'notFound'} ] }
        ]);
        controller.getOneRecord('999','show');
        setTimeout( () => {
            expect(formData.errorMsg).toBe('notFound');
        }, wait);          
    });
    test('communitiesController new test', () => {
        controller.new();
        expect(formData.compStatus).toBe('edit');
        expect(formData.created_by).toBe(controller.user.id);
    });
    test('communitiesController doFilter test OK', () => {
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
        formData.filterName = 'filerName1';
        controller.doFilter();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
            expect(formData.total).toBe(1);
        }, wait);          
    });
    test('communitiesController doFilter test notFound', () => {
       setFetchResults([
            { data:{ table:[]} },
            { data:{ table:{agregate:{count:0}}} }
       ]);
       formData.filterName = 'filerName1';
       controller.doFilter();
       setTimeout( () => {
           expect(formData.compStatus).toBe('browser');
           expect(formData.total).toBe(0);
       }, wait);          
   });
   test('communitiesController delFilter test', () => {
        setFetchResults([
            { data:{ table:[]} },
            { data:{ table:{agregate:{count:0}}} }
        ]);
        controller.delFilter();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          
    });
    test('communitiesController validator test ok', () => {
        formData.name = 'name1';
        formData.description = 'desc1';
        formData.status = 'active';
        let res = controller.validator();
        expect(res).toBe('');
    });
    test('communitiesController validator test notok', () => {
        formData.name = '';
        formData.description = '';
        formData.status = '';
        let res = controller.validator();
        expect(res.indexOf('NAME_REQUIRED')).toBeGreaterThanOrEqual(0);
        expect(res.indexOf('DESCRIPTION_REQUIRED')).toBeGreaterThanOrEqual(0);
        expect(res.indexOf('STATUS_REQUIRED')).toBeGreaterThanOrEqual(0);
    });
    test('communitiesController save test insert OK', () => {
        formData.id = '';
        formData.name = 'name1';
        formData.description = 'desc1';
        formData.status = 'active';
        controller.save();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
            expect(formData.errorMsg).toBe('');
            expect(formData.successMsg).toBe('SAVED');
        }, wait);          
    });
    test('communitiesController save test update OK', () => {
        formData.id = '123';
        formData.name = 'name1';
        formData.description = 'desc1';
        formData.status = 'active';
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
    test('communitiesController save test update not valid', () => {
        formData.id = '123';
        formData.name = '';
        formData.description = 'desc1';
        formData.status = 'active';
        formData.created_at = '200-01-01';
        formData.created_by = '111';
        controller.save();
        setTimeout( () => {
            expect(formData.compStatus).toBe('edit');
            expect(formData.errorMsg.indexOf('NAME_REQUIRED')).toBeGreaterThanOrEqual(0);
            expect(formData.successMsg).toBe('');
        }, wait);          
    });
    test('communitiesController doDelete test', () => {
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

