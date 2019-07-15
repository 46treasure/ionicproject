import {Component, OnInit} from '@angular/core';
import {User} from '../../models/User';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {Platform} from '@ionic/angular';
import {File} from '@ionic-native/file/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {UserServiceService} from '../../services/user-service.service';
import {log} from 'util';
import {AppComponent} from '../app.component';

@Component({
    selector: 'app-userpage',
    templateUrl: './userpage.page.html',
    styleUrls: ['./userpage.page.scss'],
})
export class UserpagePage implements OnInit {

    constructor(public fileChooser: FileChooser,
                public file: File,
                public platform: Platform,
                public camera: Camera,
                public router: Router,
                public userService: UserServiceService,
                public activatedRoute: ActivatedRoute,
                public app: AppComponent) {
    }

    currentUser = new User();
    currentID = 0;
    image = 'assets/ava.jpg';
    showUnshow = false;
    subButton = true;
    exist: boolean;

    ngOnInit() {

        this.activatedRoute.params.subscribe((value) => {
            this.currentID = Number(value.id);
        });
        this.userService.getCurrentUser().subscribe((res) => {
            this.currentUser = res;
            this.currentID = res.id;
        });
        this.userService.compareUser(this.currentID).subscribe((res) => {
            this.showUnshow = res;
            if (this.showUnshow === false) {
                this.subButton = true;
            } else {
                this.subButton = false;
            }
        }, () => console.log('u have to login for more rules'));

        this.userService.existIntFriends(this.currentID).subscribe((res) => {
            this.exist = res;
        });
    }

    selectFile() {
        if (this.platform.is('cordova')) {
            const options: CameraOptions = {
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            };
            this.camera.getPicture(options).then((imageData) => {
                this.image = 'data:image/jpeg;base64,' + imageData;
            });
        } else {
            alert('This is BROWSER! Function not working');
        }
    }

    logout() {
        localStorage.removeItem('_token');
        localStorage.removeItem('_currentUser');
        this.currentUser.status = 'offline';
        this.userService.setStatus('Offline').subscribe();
        this.router.navigateByUrl('/logreg/log');
    }



    subscribes() {
        this.userService.addSubscribes(this.currentID).subscribe(() => this.ngOnInit());
    }

    unSubscribes() {
        this.userService.unSubscribes(this.currentID).subscribe(() => this.ngOnInit());
        this.ngOnInit();
    }
}

