//
// Modal to show Doubtfire version info
//
import { Injectable, Component, Inject } from '@angular/core';
import { DoubtfireConstants } from 'src/app/config/constants/doubtfire-constants';
import { AboutDoubtfireModalService } from '../about-doubtfire-modal/about-doubtfire-modal.service';
import { GithubProfile } from '../about-doubtfire-modal/GithubProfile';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AboutDialogData {
  externalName: string;
  contributors: GithubProfile[];
}

@Component({
  selector: 'about-doubtfire-dialog',
  templateUrl: 'about-doubtfire-modal-content.tpl.html',
})
export class AboutDoubtfireModalContent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: AboutDialogData) { }
}

/**
 * The about doubtfire modal service - used to create and show the modal
 */
@Injectable()
export class AboutDoubtfireModal {

  aboutDialogData: AboutDialogData;

  constructor(public dialog: MatDialog,
    private constants: DoubtfireConstants,
    private aboutDoubtfireModalService: AboutDoubtfireModalService) {
    this.aboutDialogData = {
      externalName: '',
      contributors: []
    }

    this.aboutDialogData.contributors = <GithubProfile[]>this.constants.mainContributors.map(c => ({
      avatar_url: '/assets/images/person-unknown.gif',
      login: c
    }));
  }

  show() {
    this.getContributorDetails();
    this.getExternalName();
    this.dialog.open(AboutDoubtfireModalContent,
      {
        width: '900px',
        data: this.aboutDialogData
      });
  }

  private getExternalName(): void {
    this.constants.ExternalName
      .subscribe(result => {
        this.aboutDialogData.externalName = result;
      });
  }

  private getContributorDetails() {
    this.aboutDialogData.contributors.forEach((item: GithubProfile, i) => {
      this.aboutDoubtfireModalService.GetGithubProfiles(item.login)
        .subscribe(response => {
          this.aboutDialogData.contributors[i] = {
            avatar_url: response.avatar_url,
            name: response.name,
            html_url: response.html_url,
            login: response.login
          };
        });
    });
  }
}
