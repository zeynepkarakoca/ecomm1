import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    TableData: any[];
    tableLoading = false;

    NewCategoryForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required]),
        image: new FormControl(null, [Validators.required])
    });
    NewCategoryFormDetails = {
        isLoading: false,
        visible: false,
        selectedFile: null,
        onSelectedFileChange: (event) => {
            const file = (event.target as HTMLInputElement).files[0];
            this.NewCategoryFormDetails.selectedFile = file;
        }
    };

    EditCategoryForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required]),
        image: new FormControl(null)
    });
    EditCategoryFormDetails = {
        isLoading: false,
        visible: false,
        selectedFile: null,
        onSelectedFileChange: (event) => {
            const file = (event.target as HTMLInputElement).files[0];
            this.NewCategoryFormDetails.selectedFile = file;
        },
        selectedCategory: 0
    };

    NewSubcategoryForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required]),
        category_id: new FormControl(0, [Validators.required])
    });
    NewSubcategoryFormDetails = {
        visible: false,
        loading: false,
        selectedCategoryName: ''
    };

    constructor(private api: ApiService, private message: NzMessageService, private dialog: NzModalService) {
    }

    getCategories = () => {
        this.tableLoading = true;
        this.api.GetCategories()
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

    handleToggleNewCategoryForm = (state) => {
        if (!state) {
            if (this.NewCategoryForm.dirty || this.NewCategoryForm.touched) {
                this.dialog.confirm({
                    nzTitle: 'Are you sure ?',
                    nzContent: 'All input data will be lost!',
                    nzOnOk: () => {
                        this.NewCategoryForm.reset();
                        this.NewCategoryFormDetails.visible = false;
                    }
                });
            } else {
                this.NewCategoryFormDetails.visible = false;
                this.NewCategoryForm.reset();
            }
        } else {
            this.NewCategoryFormDetails.visible = true;
        }
    };
    handleNewCategoryOk = () => {

        if (this.NewCategoryForm.valid) {
            this.NewCategoryFormDetails.isLoading = true;

            const data = new FormData();
            const currentFormData = this.NewCategoryForm.value;
            data.append('name', currentFormData.name);
            data.append('status', currentFormData.status === true ? `1` : `0`);
            data.append('image', this.NewCategoryFormDetails.selectedFile);

            this.api.StoreCategory(data)
                .then((res: any) => {
                    this.message.success('Successfully added new category');
                    this.NewCategoryForm.reset();
                    this.NewCategoryFormDetails.visible = false;
                    this.getCategories();
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.NewCategoryFormDetails.isLoading = false;
                });
        }
    };

    handleToggleEditCategoryForm = (state, id = null) => {
        if (id) {
            this.EditCategoryFormDetails.isLoading = true;
            this.api.GetCategoryById(id)
                .then((res: any) => {
                    this.EditCategoryFormDetails.selectedCategory = id;
                    this.EditCategoryForm.controls.name.setValue(res.data.name);
                    this.EditCategoryForm.controls.status.setValue(res.data.status === 1);
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.EditCategoryFormDetails.isLoading = false;
                });
        }

        if (!state) {
            if (this.EditCategoryForm.dirty || this.EditCategoryForm.touched) {
                this.dialog.confirm({
                    nzTitle: 'Are you sure ?',
                    nzContent: `All input data won't be saved!`,
                    nzOnOk: () => {
                        this.EditCategoryForm.reset();
                        this.EditCategoryFormDetails.visible = false;
                    }
                });
            } else {
                this.EditCategoryFormDetails.visible = false;
                this.EditCategoryForm.reset();
            }
        } else {
            this.EditCategoryFormDetails.visible = true;
        }
    };
    handleEditCategoryOk = () => {
        if (this.EditCategoryForm.valid) {
            this.EditCategoryFormDetails.isLoading = true;

            const data = new FormData();
            const currentFormData = this.EditCategoryForm.value;
            data.append('name', currentFormData.name);
            data.append('image', this.EditCategoryFormDetails.selectedFile);
            data.append('status', currentFormData.status === true ? `1` : `0`);

            this.api.UpdateCategory(this.EditCategoryFormDetails.selectedCategory, data)
                .then((res: any) => {
                    this.message.success('Successfully updated category');
                    this.EditCategoryForm.reset();
                    this.EditCategoryFormDetails.visible = false;
                    this.getCategories();
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.EditCategoryFormDetails.isLoading = false;
                });
        }
    };

    handleDeleteCategory = (id) => {
        this.dialog.confirm({
            nzTitle: 'Are you sure ?',
            nzContent: '...',
            nzOnOk: () => {
                this.api.DeleteCategory(id)
                    .then((res: any) => {
                        this.message.success(res && res.message);
                        this.getCategories();
                    })
                    .catch(error => {
                        this.message.error(error.error && error.error.message);
                    });
            }
        });
    };

    /* Subcategories */
    handleToggleNewSubcategoryForm = (state, categoryId = null, categoryName = null) => {
        if (categoryId) {
            this.NewSubcategoryForm.controls.category_id.setValue(categoryId);
        }
        if (categoryName) {
            this.NewSubcategoryFormDetails.selectedCategoryName = categoryName;
        }
        if (!state) {
            if (this.NewSubcategoryForm.dirty || this.NewSubcategoryForm.touched) {
                this.dialog.confirm({
                    nzTitle: 'Are you sure ?',
                    nzContent: 'All input data will be lost!',
                    nzOnOk: () => {
                        this.NewSubcategoryForm.reset();
                        this.NewSubcategoryFormDetails.visible = false;
                    }
                });
            } else {
                this.NewSubcategoryFormDetails.visible = false;
                this.NewSubcategoryForm.reset();
            }
        } else {
            this.NewSubcategoryFormDetails.visible = true;
        }
    };
    handleNewSubcategoryFormOk = () => {
        if (this.NewSubcategoryForm.valid) {
            const data = this.NewSubcategoryForm.value;
            data.status = data.status === true ? 1 : 0;

            this.NewSubcategoryFormDetails.loading = true;
            this.api.StoreSubCategory(data)
                .then((res: any) => {
                    this.message.success('Successfully added new subcategory to ' + this.NewSubcategoryFormDetails.selectedCategoryName);
                    this.NewSubcategoryForm.reset();
                    this.NewSubcategoryFormDetails = {
                        loading: false,
                        selectedCategoryName: '',
                        visible: false
                    };
                    this.getCategories();
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.NewSubcategoryFormDetails.loading = false;
                });
        } else {
            this.message.error('Please fill all fields');
        }
    };

    ngOnInit(): void {
        this.getCategories();
    }

}
