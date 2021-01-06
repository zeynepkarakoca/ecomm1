import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-sub-categories',
    templateUrl: './sub-categories.component.html',
    styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent implements OnInit {

    parentCategoryList: any[];
    TableData: any[];
    tableLoading = false;

    _filters = {
        category_id: null
    };

    NewSubcategoryForm: FormGroup = new FormGroup({
        category_id: new FormControl(null, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required])
    });
    NewSubcategoryFormDetails = {
        visible: false,
        loading: false
    };

    EditSubcategoryForm: FormGroup = new FormGroup({
        category_id: new FormControl(null, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required])
    });
    EditSubcategoryFormDetails = {
        visible: false,
        loading: false,
        selectedSubcategoryId: 0
    };


    constructor(private api: ApiService, private dialog: NzModalService, private message: NzMessageService) {
    }

    getParentCategories = () => {
        this.api.GetCategories()
            .then((res: any) => {
                this.parentCategoryList = res.data;
            })
            .catch(error => {
                this.message.error(error.error && error.error.message);
            })
            .finally(() => {
                // Do loading false
            });
    };
    getSubcategories = (filters = null) => {
        this.tableLoading = true;
        this.api.GetSubCategories(filters)
            .then((res: any) => {
                this.TableData = res.data;
            })
            .catch(error => {
                this.message.error(error.error && error.error.message);
            })
            .finally(() => {
                this.tableLoading = false;
            });
    };

    handleFilterChange = (event) => {
        this.getSubcategories(this._filters.category_id);
    };

    handleToggleNewSubcategoryForm = (state) => {
        if (state === false) {
            if (this.NewSubcategoryForm.dirty || this.NewSubcategoryForm.touched) {
                this.dialog.confirm({
                    nzTitle: 'Are you sure ?',
                    nzContent: 'All input data will be lost!',
                    nzOnOk: () => {
                        this.NewSubcategoryForm.reset();
                        this.NewSubcategoryFormDetails = {
                            visible: false,
                            loading: false
                        };
                    }
                });
            } else {
                this.NewSubcategoryFormDetails = {
                    visible: false,
                    loading: false
                };
            }
        } else {
            this.NewSubcategoryFormDetails = {
                visible: true,
                loading: false
            };
        }
    };
    handleNewSubcategoryOk = () => {
        if (this.NewSubcategoryForm.valid) {
            this.NewSubcategoryFormDetails.loading = true;
            const data = this.NewSubcategoryForm.value;
            data.status = data.status === true ? 1 : 0;
            this.api.StoreSubCategory(data)
                .then((res: any) => {
                    this.message.success('Successfully added new subcategory');
                    this.NewSubcategoryForm.reset();
                    this.handleToggleNewSubcategoryForm(false);
                    this.getSubcategories();
                    this.getParentCategories();
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.NewSubcategoryFormDetails.loading = false;
                });
        } else {
            this.message.error('Please fill all fields!');
        }
    };

    handleToggleEditSubcategoryForm = (id = null, state) => {
        if (id) {
            this.api.GetSubCategoryById(id)
                .then((res: any) => {
                    this.EditSubcategoryForm.controls.category_id.setValue(res.data.category_id.id);
                    this.EditSubcategoryForm.controls.name.setValue(res.data.name);
                    this.EditSubcategoryForm.controls.description.setValue(res.data.description);
                    this.EditSubcategoryForm.controls.status.setValue(res.data.status === 1);
                    this.EditSubcategoryFormDetails.loading = false;
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.EditSubcategoryFormDetails.loading = false;
                });
        }
        if (state === false) {
            if (this.EditSubcategoryForm.dirty || this.EditSubcategoryForm.touched) {
                this.dialog.confirm({
                    nzTitle: 'Are you sure ?',
                    nzContent: 'All input data will be lost!',
                    nzOnOk: () => {
                        this.EditSubcategoryForm.reset();
                        this.EditSubcategoryFormDetails = {
                            visible: false,
                            loading: false,
                            selectedSubcategoryId: 0
                        };
                    }
                });
            } else {
                this.EditSubcategoryFormDetails = {
                    visible: false,
                    loading: false,
                    selectedSubcategoryId: 0
                };
            }
        } else {
            this.EditSubcategoryFormDetails = {
                visible: true,
                loading: false,
                selectedSubcategoryId: id
            };
        }
    };
    handleEditSubcategoryOk = () => {
        if (this.EditSubcategoryForm.valid) {
            this.EditSubcategoryFormDetails.loading = true;
            const data = this.EditSubcategoryForm.value;
            data.status = data.status === true ? 1 : 0;
            this.api.UpdateSubCategory(this.EditSubcategoryFormDetails.selectedSubcategoryId, data)
                .then((res: any) => {
                    this.message.success('Successfully updated subcategory');
                    this.EditSubcategoryForm.reset();
                    this.handleToggleEditSubcategoryForm(0, false);
                    this.getSubcategories();
                    this.getParentCategories();
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.EditSubcategoryFormDetails.loading = false;
                });
        } else {
            this.message.error('Please fill all fields!');
        }
    };

    handleDeleteSubcategory = (id) => {
        this.dialog.confirm({
            nzTitle: 'Are you sure ?',
            nzContent: '...',
            nzOnOk: () => {
                this.api.DeleteSubCategory(id)
                    .then((res: any) => {
                       this.message.success(res && res.message);
                    })
                    .catch(error => {
                        this.message.error(error.error && error.error.message);
                    })
                    .finally(() => {
                        this.getParentCategories();
                        this.getSubcategories();
                    });
            }
        });
    };

    ngOnInit(): void {
        this.getSubcategories();
        this.getParentCategories();
    }

}
