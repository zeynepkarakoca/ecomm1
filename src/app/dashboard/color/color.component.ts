import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

    TableData: any[];
    tableLoading = false;

    paginationData = {
        pageIndex: 1,
        canNext: false,
        canPrev: false
    };

    newColorForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        hex_code: new FormControl('', [Validators.required]),
        slug: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required])
    });
    editColorForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        hex_code: new FormControl('', [Validators.required]),
        slug: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required])
    });
    currentColorId = 0;

    newColorFormDetails = {
        visible: false,
        loading: false
    };
    editColorFormDetails = {
        visible: false,
        loading: false
    };


    constructor(private api: ApiService, private dialog: NzModalService, private message: NzMessageService) {
    }

    getColors = () => {
        this.tableLoading = true;
        this.api.GetColors(this.paginationData.pageIndex)
            .then((res: any) => {
                if (res.data) {
                    this.TableData = res.data;
                }
            })
            .catch(error => {
                console.error(error.error && error.error.message);
            })
            .finally(() => {
                this.tableLoading = false;
            });
    };

    handleToggleNewColorForm = (state: boolean) => {
        if (state === false) {
            if (this.newColorForm.dirty || this.newColorForm.touched) {
                const result = this.dialog.confirm({
                    nzTitle: 'Close dialog ?',
                    nzContent: 'All input data will be lost!',
                    nzOnOk: () => {
                        this.newColorForm.reset();
                        this.newColorFormDetails.visible = state;
                    }
                });
            } else {
                this.newColorForm.reset();
                this.newColorFormDetails.visible = state;
            }
        } else {
            this.newColorFormDetails.visible = state;
        }
    };
    handleNewColorFormOk = () => {
        if (this.newColorForm.valid) {
            this.newColorFormDetails.loading = true;
            const data = this.newColorForm.value;
            data.status = data.status === true ? 1 : 0;
            this.api.StoreColor(data)
                .then((res: any) => {
                    if (res.success === true) {
                        this.message.success('Successfully added new color!');
                    }
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.newColorFormDetails.loading = false;
                    this.newColorFormDetails.visible = false;
                    this.newColorForm.reset();
                    this.getColors();
                });
        } else {
            this.message.error('Fields are not valid!');
        }
    };

    handleToggleEditColorForm = (state: boolean, id = null) => {
        if (id) {
            this.currentColorId = id;
            this.editColorFormDetails.loading = true;
            this.api.GetColorById(id)
                .then((res: any) => {
                    if (res && res.data) {
                        this.editColorForm.controls.name.setValue(res.data.name);
                        this.editColorForm.controls.status.setValue(res.data.status === 1);
                        this.editColorForm.controls.hex_code.setValue(res.data.hex_code);
                        this.editColorForm.controls.slug.setValue(res.data.slug);
                    }
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.editColorFormDetails.loading = false;
                });
        }
        if (state === false) {
            if (this.editColorForm.dirty || this.editColorForm.touched) {
                const result = this.dialog.confirm({
                    nzTitle: 'Close dialog ?',
                    nzContent: 'The entered data will not be saved!',
                    nzOnOk: () => {
                        this.editColorForm.reset();
                        this.editColorFormDetails.visible = state;
                    }
                });
            } else {
                this.editColorForm.reset();
                this.editColorFormDetails.visible = state;
            }
        } else {
            this.editColorFormDetails.visible = state;
        }
    };
    handleEditColorFormOk = () => {
        if (this.editColorForm.valid) {
            this.editColorFormDetails.loading = true;
            const data = this.editColorForm.value;
            data.status = data.status === true ? 1 : 0;
            this.api.UpdateColor(this.currentColorId, data)
                .then((res: any) => {
                    if (res.success === true) {
                        this.message.success('Successfully updated color!');
                    }
                })
                .catch(error => {
                    this.message.error(error.error && error.error.message);
                })
                .finally(() => {
                    this.editColorFormDetails.loading = false;
                    this.editColorFormDetails.visible = false;
                    this.editColorForm.reset();
                    this.currentColorId = 0;
                    this.getColors();
                });
        } else {
            this.message.error('Fields are not valid!');
        }
    };

    handleDeleteColor = (id) => {
        this.dialog.confirm({
            nzTitle: 'Delete color',
            nzContent: 'Are you sure ?',
            nzOnOk: () => {
                this.api.DeleteColor(id)
                    .then((res: any) => {
                        if (res.message) {
                            this.message.success(res && res.message);
                        }
                        ;
                    })
                    .catch(error => {
                        this.message.error(error.error && error.error.message);
                    })
                    .finally(() => {
                        this.getColors();
                    });
            }
        });
    };

    ngOnInit(): void {
        this.getColors();
    }

}
