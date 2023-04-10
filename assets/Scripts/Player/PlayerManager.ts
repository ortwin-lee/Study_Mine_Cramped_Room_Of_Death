import {
    _decorator,
    Component,
    Sprite,
    UITransform,
    Animation,
    AnimationClip,
    animation,
    SpriteFrame,
    SpriteAtlas,
} from "cc";
import { ANIMATION_SPEED, TILE_HEIGHT, TILE_WIDTH } from "../Const";
import { ResourceManager } from "../Runtime/ResourceManager";
import { CONTROLLER_ENUM, EVENT_ENUM } from "../Enum";
import EventManager from "../Runtime/EventManager";
const { ccclass } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends Component {
    x: number = 0;
    y: number = 0;
    targetX: number = 0;
    targetY: number = 0;
    private readonly speed = 1 / 10;

    async init() {
        await this.render();
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this);
    }

    update() {
        this.updateXY();
        this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HEIGHT);
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.move, this);
    }

    updateXY() {
        if (this.targetX < this.x) {
            this.x -= this.speed;
        } else if (this.targetX > this.x) {
            this.x += this.speed;
        }

        if (this.targetY < this.y) {
            this.y -= this.speed;
        } else if (this.targetY > this.y) {
            this.y += this.speed;
        }

        if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
            this.x = this.targetX;
            this.y = this.targetY;
        }
    }

    move(inputDirection: CONTROLLER_ENUM) {
        switch (inputDirection) {
            case CONTROLLER_ENUM.TOP:
                this.targetY -= 1;
                break;
            case CONTROLLER_ENUM.BOTTOM:
                this.targetY += 1;
                break;
            case CONTROLLER_ENUM.LEFT:
                this.targetX -= 1;
                break;
            case CONTROLLER_ENUM.RIGHT:
                this.targetX += 1;
                break;
        }
    }

    async render() {
        const spirteComponent = this.node.addComponent(Sprite);
        spirteComponent.sizeMode = Sprite.SizeMode.CUSTOM;

        const transformComponet = this.node.getComponent(UITransform);
        transformComponet?.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

        const spriteAtlas = await ResourceManager.Instance.loadRes("texture/player/idle/top/idle", SpriteAtlas);
        const spriteFrames = spriteAtlas.getSpriteFrames();

        const animationComponent = this.node.addComponent(Animation);

        const animationClip = new AnimationClip();

        const track = new animation.ObjectTrack();
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty("spriteFrame");
        const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item]);
        track.channel.curve.assignSorted(frames);

        // 最后将轨道添加到动画剪辑以应用
        animationClip.addTrack(track);
        animationClip.duration = frames.length * ANIMATION_SPEED; // 整个动画剪辑的周期
        animationClip.wrapMode = AnimationClip.WrapMode.Loop;

        animationComponent.defaultClip = animationClip;
        animationComponent.play();
    }
}
