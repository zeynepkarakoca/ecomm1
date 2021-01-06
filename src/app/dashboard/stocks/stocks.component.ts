import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-stocks',
    templateUrl: './stocks.component.html',
    styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {

    constructor(private api: ApiService, private dialog: NzModalService, private message: NzMessageService) {
    }

    TableData: any[];
    tableLoading = false;

    colorList: any[];
    productList: any[];

    NewStockForm: FormGroup = new FormGroup({
        size: new FormControl('', [Validators.required]),
        color_id: new FormControl(0, [Validators.required]),
        product_id: new FormControl(0, [Validators.required]),
        number: new FormControl(0, [Validators.required]),
        status: new FormControl(true, [Validators.required])
    });
    NewStockFormDetails = {
        visible: false,
        loading: false
    };

    EditStockForm: FormGroup = new FormGroup({
        size: new FormControl('', [Validators.required]),
        color_id: new FormControl(0, [Validators.required]),
        product_id: new FormControl(0, [Validators.required]),
        number: new FormControl(0, [Validators.required]),
        status: new FormControl(true, [Validators.required])
    });
    EditStockFormDetails = {
        visible: false,
        loading: false,
        selectedStockId: 0
    };

    handleNewStockOk = () => {
        if (this.NewStockForm.valid) {
            this.NewStockFormDetails.loading = true;
            const data = this.NewStockForm.value;
            data.status = data.status === true ? 1 : 0;
            this.api.StoreStock(data)
                .then((res: any) => {
                    this.message.success('Successfully added new stock');
                    this.NewStockForm.reset();
                    this.NewStockFormDetails.visible = false;
                })
                .catch(error => this.message.error(error.error && error.error.message))
                .finally(() => {
                    this.NewStockFormDetails.loading = false;
                    this.getStocks();
                });
        }
    };
    handleToggleNewStockForm = (state) => {
        if (state === false) {
            if (this.NewStockForm.dirty || this.NewStockForm.touched) {
                this.dialog.confirm({
                    nzTitle: 'Are you sure ?',
                    nzContent: 'All input data will be lost',
                    nzOnOk: () => {
                        this.NewStockFormDetails = {
                            visible: false,
                            loading: false
                        };
                    }
                });
            } else {
                this.NewStockFormDetails = {
                    visible: false,
                    loading: false
                };
            }
        } else {
            this.NewStockFormDetails = {
                visible: true,
                loading: false
            };
        }

    };

    handleEditStockOk = () => {
        if (this.EditStockForm.valid) {
            this.EditStockFormDetails.loading = true;
            const data = this.EditStockForm.value;
            data.status = data.status === true ? 1 : 0;
            this.api.UpdateStock(this.EditStockFormDetails.selectedStockId, data)
                .then((res: any) => {
                    this.message.success('Successfully updated stock');
                    this.EditStockForm.reset();
                    this.EditStockFormDetails.visible = false;
                })
                .catch(error => this.message.error(error.error && error.error.message))
                .finally(() => {
                    this.EditStockFormDetails.loading = false;
                    this.getStocks();
                });
        }
    };
    handleToggleEditStockForm = (state, id = null) => {
        if (id) {
            this.api.GetStockById(id)
                .then((res: any) => {
                    this.EditStockForm.controls.size.setValue(res.data.size);
                    this.EditStockForm.controls.color_id.setValue(res.data.color_id.id);
                    this.EditStockForm.controls.product_id.setValue(res.data.product_id.id);
                    this.EditStockForm.controls.number.setValue(res.data.number);
                    this.EditStockForm.controls.status.setValue(res.data.status === 1);
                })
                .catch(error => this.message.error(error.error && error.error.message));
        }

        if (state === false) {
            if (this.EditStockForm.dirty || this.EditStockForm.touched) {
                this.dialog.confirm({
                    nzTitle: 'Are you sure ?',
                    nzContent: 'All input data won\'t be saved!',
                    nzOnOk: () => {
                        this.EditStockFormDetails = {
                            visible: false,
                            loading: false,
                            selectedStockId: 0
                        };
                    }
                });
            } else {
                this.EditStockFormDetails = {
                    visible: false,
                    loading: false,
                    selectedStockId: 0
                };
            }
        } else {
            this.EditStockFormDetails = {
                visible: true,
                loading: false,
                selectedStockId: id
            };
        }

    };

    handleDeleteStock = (id) => {
        this.dialog.confirm({
            nzTitle: 'Are you sure ?',
            nzContent: '...',
            nzOnOk: () => {
                this.api.DeleteStock(id)
                    .then((res: any) => this.message.success(res && res.message))
                    .catch(error => this.message.error(error.error && error.error.message))
                    .finally(() => this.getStocks());
            }
        });
    };

    getStocks = () => {
        this.tableLoading = true;
        this.api.GetStocks()
            .then((res: any) => this.TableData = res.data)
            .catch(error => this.message.error(error.error && error.error.message))
            .finally(() => this.tableLoading = false);
    };
    getColorList = () => {
        this.api.GetColors()
            .then((res: any) => this.colorList = res.data)
            .catch(error => this.message.error(error.error && error.error.message));
    };
    getProductList = () => {
        this.api.GetProducts()
            .then((res: any) => this.productList = res.data)
            .catch(error => this.message.error(error.error && error.error.message));
    };

    ngOnInit(): void {
        this.getStocks();
        this.getColorList();
        this.getProductList();
    }

}
