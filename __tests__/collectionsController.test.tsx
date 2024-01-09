import '@testing-library/jest-dom';
import { CollectionController, FormData } from '../components/Collections/CollectionsController';
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
    owner: '',
    created_by: '',
    creatorName: '',
    created_at: '',
    updated_by: '',
    updaterName: '',
    updated_at: '',
    community_id: '',
    communityName: '',
    // filter form
    filterName: '',
    filterDescription: '',
    filterStatus: '',
    filterCommunityName: '',
    filterCommunityId: '',
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
    if (fname == 'owner') formData.owner = value;
    if (fname == 'created_by') formData.created_by = value;
    if (fname == 'creatorName') formData.creatorName = value;
    if (fname == 'created_at') formData.created_at = value;
    if (fname == 'updated_by') formData.updated_by = value;
    if (fname == 'updaterName') formData.updaterName = value;
    if (fname == 'updated_at') formData.updated_at = value;
    if (fname == 'community_id') formData.community_id = value;
    if (fname == 'communityName') formData.communityName = value;
    if (fname == 'filterName') formData.filterName = value;
    if (fname == 'filterDescription') formData.filterDescription = value;
    if (fname == 'filterStatus') formData.filterStatus = value;
    if (fname == 'filterCommunityName') formData.filterCommunityName = value;
    if (fname == 'offset') formData.offset = value;
    if (fname == 'order') formData.order = value;
    if (fname == 'total') formData.total = value;
    if (fname == 'items') formData.items = value;
    if (fname == 'pages') formData.pages = value;
}

describe("CollectionController test", () => {
    const controller = new CollectionController();
    const wait = 500; // ms wait for asnc process
    const record0 = {
        id:'123', 
        name: 'name123',
        description:'',
        status:'',
        created_by:'',
        created_at:'',
        updated_by:'',
        updated_at:'', 
        user_creator: {username_public: ''},
        user_modifier: {username_public: ''},
        owner:'',
        resource_community_id:'',
        resource_community:{name:''}
    }

    test('collectionsController onLoad id=="0"', () => {
        controller.id = '0';
        let record = record0;
        setFetchResults([
            { data:{ table:[record]} },
            { data:{ table:{agregate:{count:1}}} }
        ]);
        controller.onLoad('0', setFormDataField, getFormData);
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          
    });    
    test('collectionsController onLoad id!="0"', () => {
        controller.id != '0';
        let record = record0;
        setFetchResults([
            { data:{ table:[record]} },
            { data:{ table:[record]} },
            { data:{ table:{agregate:{count:1}}} }
        ]);
        controller.onLoad('1', setFormDataField, getFormData);
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          
    });    
    test('collectionsController getOneRecord OK test', () => {
        let record = record0;
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
    test('collectionsController getOneRecord notfound test', () => {
        setFetchResults([
            { errors:[ {message:'notFound'} ] }
        ]);
        controller.getOneRecord('999','show');
        setTimeout( () => {
            expect(formData.errorMsg).toBe('notFound');
        }, wait);          
    });
    test('collectionsController new test', () => {
        let record = record0;
         setFetchResults([
             { data:{ table:[record]} }
         ]);
        controller.new();
        expect(formData.compStatus).toBe('edit');
        expect(formData.created_by).toBe(controller.user.id);
    });
    test('collectionsController doFilter test OK', () => {
        let record = record0;
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
    test('collectionsController doFilter test notFound', () => {
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
   test('collectionsController delFilter test', () => {
        setFetchResults([
            { data:{ table:[]} },
            { data:{ table:{agregate:{count:0}}} }
        ]);
        controller.delFilter();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          
    });
    test('collectionsController validator test ok', () => {
        formData.name = 'name1';
        formData.description = 'desc1';
        formData.status = 'active';
        let res = controller.validator();
        expect(res).toBe('');
    });
    test('collectionsController validator test notok', () => {
        formData.name = '';
        formData.description = '';
        formData.status = '';
        let res = controller.validator();
        expect(res.indexOf('NAME_REQUIRED')).toBeGreaterThanOrEqual(0);
        expect(res.indexOf('DESCRIPTION_REQUIRED')).toBeGreaterThanOrEqual(0);
        expect(res.indexOf('STATUS_REQUIRED')).toBeGreaterThanOrEqual(0);
    });
    test('collectionsController save test insert OK', () => {
        formData.id = '';
        formData.name = 'name1';
        formData.description = 'desc1';
        formData.status = 'active';
        setFetchResults([
            { data:{ id:'123' } },
            { data:{ table:[]} },
            { data:{ table:{agregate:{count:0}}} }
        ]);
        controller.save();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
            expect(formData.errorMsg).toBe('');
            expect(formData.successMsg).toBe('SAVED');
        }, wait);          
    });
    test('collectionsController save test update OK', () => {
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
    test('collectionsController save test update not valid', () => {
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
});

