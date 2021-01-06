import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

    TableData: any[];
    tableLoading = false;

    SubcategoriesList: any[];

    newProductForm: FormGroup = new FormGroup({
        sub_category_id: new FormControl(0, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required]),
        material: new FormControl('', [Validators.required]),
        design: new FormControl('', [Validators.required]),
        price: new FormControl(0, [Validators.required]),
        gender: new FormControl(0, [Validators.required]),
        slug: new FormControl('', [Validators.required]),
        image1: new FormControl(null),
        image2: new FormControl(null)

    });
    newProductFormDetails = {
        visible: false,
        loading: false,
        selectedImage1: null,
        selectedImage2: null
    };

    editProductForm: FormGroup = new FormGroup({
        sub_category_id: new FormControl(0, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required]),
        material: new FormControl('', [Validators.required]),
        design: new FormControl('', [Validators.required]),
        price: new FormControl(0, [Validators.required]),
        gender: new FormControl(0, [Validators.required]),
        slug: new FormControl('', [Validators.required]),
        image1: new FormControl(null),
        image2: new FormControl(null)

    });
    editProductFormDetails = {
        visible: false,
        loading: false,
        selectedImage1: null,
        selectedImage2: null,
        selectedId: 0
    };


    constructor(private api: ApiService, private dialog: NzModalService, private message: NzMessageService) {
    }

    getProducts = () => {
        this.tableLoading = true;
        this.api.GetProducts()
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
    getSubcategories = () => {
        this.api.GetSubCategories()
            .then((res: any) => {
                this.SubcategoriesList = res.data;
            })
            .catch(error => {
                this.message.error(error.error && error.error.message);
            });
    };

    handleToggleNewProductForm = (state) => {
        if (state === false) {
            if (this.newProductForm.touched || this.newProductForm.dirty) {
                this.dialog.confirm({
                    nzTitle: 'Are you sure ?',
                    nzContent: 'All input data will be lost',
                    nzOnOk: () => {
                        this.newProductForm.reset();
                        this.newProductFormDetails = {
                            visible: false,
                            loading: false,
                            selectedImage1: null,
                            selectedImage2: null
                        };
                    }
                });
            } else {
                this.newProductForm.reset();
                this.newProductFormDetails = {
                    visible: false,
                    loading: false,
                    selectedImage1: null,
                    selectedImage2: null
                };
            }
        } else {
            this.newProductForm.reset();
            this.newProductFormDetails = {
                visible: true,
                loading: false,
                selectedImage1: null,
                selectedImage2: null
            };
        }
    };
    handleNewProductOk = () => {
        if (this.newProductForm.valid) {
            const formData = new FormData();
            const currentFormData = this.newProductForm.value;

            formData.append('sub_category_id', currentFormData.sub_category_id);
            formData.append('name', currentFormData.name);
            formData.append('description', currentFormData.description);
            formData.append('status', currentFormData.status === true ? '1' : '0');
            formData.append('material', currentFormData.material);
            formData.append('design', currentFormData.design);
            formData.append('price', currentFormData.price);
            formData.append('gender', currentFormData.gender);
            formData.append('slug', currentFormData.slug);
            formData.append('image[0]', this.newProductFormDetails.selectedImage1);
            formData.append('image[1]', this.newProductFormDetails.selectedImage2);

            this.newProductFormDetails.loading = true;
            this.api.StoreProduct(formData)
                .then((res: any) => {
                    this.message.success('Successfully added new product');
                    this.newProductForm.reset();
                    this.handleToggleNewProductForm(false);
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.getProducts();
                });
        }
    };

    handleToggleEditProductForm = (state, id = null) => {
        if (id) {
            this.api.GetProductById(id)
                .then((res: any) => {
                    this.editProductForm.controls.sub_category_id.setValue(res.data.sub_category_id.id);
                    this.editProductForm.controls.name.setValue(res.data.name);
                    this.editProductForm.controls.description.setValue(res.data.description);
                    this.editProductForm.controls.status.setValue(res.data.status === 1);
                    this.editProductForm.controls.material.setValue(res.data.material);
                    this.editProductForm.controls.design.setValue(res.data.design);
                    this.editProductForm.controls.price.setValue(res.data.price);
                    this.editProductForm.controls.gender.setValue(res.data.gender);
                    this.editProductForm.controls.slug.setValue(res.data.slug);
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                });
        }
        if (state === false) {
            if (this.editProductForm.touched || this.editProductForm.dirty) {
                this.dialog.confirm({
                    nzTitle: 'Are you sure ?',
                    nzContent: 'All input data will be lost',
                    nzOnOk: () => {
                        this.editProductForm.reset();
                        this.editProductFormDetails = {
                            visible: false,
                            loading: false,
                            selectedImage1: null,
                            selectedImage2: null,
                            selectedId: null
                        };
                    }
                });
            } else {
                this.editProductForm.reset();
                this.editProductFormDetails = {
                    visible: false,
                    loading: false,
                    selectedImage1: null,
                    selectedImage2: null,
                    selectedId: null
                };
            }
        } else {
            this.editProductFormDetails.visible = true;
            this.editProductFormDetails.loading = false;
            this.editProductFormDetails.selectedId = id;
        }
    };

    handleEditProductOk = () => {
        if (this.editProductForm.valid) {
            const formData = new FormData();
            const currentFormData = this.editProductForm.value;

            formData.append('sub_category_id', currentFormData.sub_category_id);
            formData.append('name', currentFormData.name);
            formData.append('description', currentFormData.description);
            formData.append('status', currentFormData.status === true ? '1' : '0');
            formData.append('material', currentFormData.material);
            formData.append('design', currentFormData.design);
            formData.append('price', currentFormData.price);
            formData.append('gender', currentFormData.gender);
            formData.append('slug', currentFormData.slug);
            formData.append('image[0]', this.editProductFormDetails.selectedImage1);
            formData.append('image[1]', this.editProductFormDetails.selectedImage2);

            this.editProductFormDetails.loading = true;
            this.api.UpdateProduct(this.editProductFormDetails.selectedId, formData)
                .then((res: any) => {
                    this.message.success('Successfully updated product');
                    this.editProductForm.reset();
                    this.handleToggleEditProductForm(false);
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.getProducts();
                });
        }
    };

    onSelectedImageChange = (event, target) => {
        const file = (event.target as HTMLInputElement).files[0];
        if (target === 1) {
            this.newProductFormDetails.selectedImage1 = file;
        } else {
            this.newProductFormDetails.selectedImage2 = file;
        }
        if (target === 'b1') {
            this.editProductFormDetails.selectedImage1 = file;
        } else if (target === 'b2') {
            this.editProductFormDetails.selectedImage2 = file;
        }
    };

    handleDeleteProduct = (id) => {
        this.dialog.confirm({
            nzTitle: 'Are you sure ?',
            nzContent: '...',
            nzOnOk: () => {
                this.api.DeleteProduct(id)
                    .then((res: any) => this.message.success(res && res.message))
                    .catch(error => this.message.error(error.error && error.error.message))
                    .finally(() => this.getProducts());
            }
        });
    };

    ngOnInit(): void {
        this.getProducts();
        this.getSubcategories();
    }

}
