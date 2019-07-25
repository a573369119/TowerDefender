/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
export module ui.Dialog_ {
    export class FloatMsgUI extends Scene {
		public ani1:Laya.FrameAnimation;
		public sp_floatMsg:Laya.Sprite;
		public lab_floatMsg:Laya.Label;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("Dialog_/FloatMsg");
        }
    }
}
export module ui.Game {
    export class GameUI extends Scene {
		public game:Laya.Sprite;
		public Woods:Laya.Sprite;
		public Wood1:Laya.Sprite;
		public Wood2:Laya.Sprite;
		public Wood3:Laya.Sprite;
		public Wood4:Laya.Sprite;
		public Walls:Laya.Sprite;
		public UpWall:Laya.Sprite;
		public DownWall:Laya.Sprite;
		public Groups:Laya.Sprite;
		public red_group:Laya.Sprite;
		public red_door:Laya.Sprite;
		public red_Grass:Laya.Sprite;
		public blue_group:Laya.Sprite;
		public blue_door:Laya.Sprite;
		public blue_Grass:Laya.Sprite;
		public road:Laya.Sprite;
		public MenuItem:Laya.Sprite;
		public shovel_off:Laya.Sprite;
		public shovel_on:Laya.Sprite;
		public shovelbg:Laya.Sprite;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("Game/Game");
        }
    }
}
export module ui.GameLobby {
    export class GameLobbyUI extends Scene {
		public bg:Laya.Sprite;
		public MenuItemPanel:Laya.Sprite;
		public btn_PVP:Laya.Sprite;
		public ModeChoosePanel:Laya.Sprite;
		public text_1V1:laya.display.Text;
		public btn_1V1:Laya.Button;
		public text_5V5:laya.display.Text;
		public btn_5V5:Laya.Button;
		public btn_back:Laya.Sprite;
		public MatchingSuccessPanel:Laya.Sprite;
		public red_group:Laya.Sprite;
		public icon_red_player_1:Laya.Sprite;
		public icon_red_player_2:Laya.Sprite;
		public icon_red_player_3:Laya.Sprite;
		public icon_red_player_4:Laya.Sprite;
		public icon_red_player_5:Laya.Sprite;
		public blue_group:Laya.Sprite;
		public icon_blue_player_1:Laya.Sprite;
		public icon_blue_player_2:Laya.Sprite;
		public icon_blue_player_3:Laya.Sprite;
		public icon_blue_player_4:Laya.Sprite;
		public icon_blue_player_5:Laya.Sprite;
		public btn_entergame:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("GameLobby/GameLobby");
        }
    }
}
export module ui {
    export class PlayerLoadingUI extends Scene {
		public loadingbg:Laya.Sprite;
		public red_group:Laya.Sprite;
		public red_player_1:Laya.Sprite;
		public name_red_player_1:laya.display.Text;
		public icon_red_player_1:Laya.Sprite;
		public red_player_2:Laya.Sprite;
		public name_red_player_2:laya.display.Text;
		public icon_red_player_2:Laya.Sprite;
		public red_player_3:Laya.Sprite;
		public name_red_player_3:laya.display.Text;
		public icon_red_player_3:Laya.Sprite;
		public red_player_4:Laya.Sprite;
		public name_red_player_4:laya.display.Text;
		public icon_red_player_4:Laya.Sprite;
		public red_player_5:Laya.Sprite;
		public name_red_player_5:laya.display.Text;
		public icon_red_player_5:Laya.Sprite;
		public blue_group:Laya.Sprite;
		public blue_player_1:Laya.Sprite;
		public name_blue_player_1:laya.display.Text;
		public icon_blue_player_1:Laya.Sprite;
		public blue_player_2:Laya.Sprite;
		public name_blue_player_2:laya.display.Text;
		public icon_blue_player_2:Laya.Sprite;
		public blue_player_3:Laya.Sprite;
		public name_blue_player_3:laya.display.Text;
		public icon_blue_player_3:Laya.Sprite;
		public blue_player_4:Laya.Sprite;
		public name_blue_player_4:laya.display.Text;
		public icon_blue_player_4:Laya.Sprite;
		public blue_player_5:Laya.Sprite;
		public name_blue_player_5:laya.display.Text;
		public icon_blue_player_5:Laya.Sprite;
		public loadingBarBg:Laya.Sprite;
		public sprite_progress:Laya.Sprite;
		public sprite_light:Laya.Sprite;
		public text_progress:Laya.Label;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("PlayerLoading");
        }
    }
}
export module ui.Welcome {
    export class LoginUI extends Scene {
		public ani1:Laya.FrameAnimation;
		public sp_loginBox:Laya.Sprite;
		public input_userName:Laya.TextInput;
		public input_userKey:Laya.TextInput;
		public lab_title:Laya.Label;
		public btn_login:Laya.Button;
		public btn_register:Laya.Button;
		public sp_progress:Laya.Sprite;
		public sp_progressW:Laya.Sprite;
		public sp_progressL:Laya.Sprite;
		public sp_progressT:Laya.Label;
		public sp_gameName:laya.display.Text;
		public sp_registerBox:Laya.Sprite;
		public input_registerUserName:Laya.TextInput;
		public input_registerUserKey:Laya.TextInput;
		public btn_toLogin:Laya.Button;
		public btn_toRegister:Laya.Button;
		public input_registerNickName:Laya.TextInput;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("Welcome/Login");
        }
    }
}