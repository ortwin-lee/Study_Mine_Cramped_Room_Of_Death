import { AnimationClip, Sprite, SpriteAtlas, SpriteFrame, animation } from "cc";
import { ANIMATION_SPEED } from "../Const";
import { ResourceManager } from "../Runtime/ResourceManager";
import { StateMachine } from "./StateMachine";

/**
 * 1. 需要知道animationClip
 * 2. 需要播放动画的能力
 */
export default class State {
    private animationClip: AnimationClip;

    constructor(
        private fsm: StateMachine,
        private path: string,
        private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    ) {
        this.init();
    }

    async init() {
        const promise = ResourceManager.Instance.loadRes(this.path, SpriteAtlas);
        this.fsm.waitingList.push(promise);

        const spriteAtlas = await promise;
        const spriteFrames = spriteAtlas.getSpriteFrames();

        this.animationClip = new AnimationClip();

        const track = new animation.ObjectTrack();
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty("spriteFrame");
        const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item]);
        track.channel.curve.assignSorted(frames);

        // 最后将轨道添加到动画剪辑以应用
        this.animationClip.addTrack(track);
        this.animationClip.name = this.path;
        this.animationClip.duration = frames.length * ANIMATION_SPEED; // 整个动画剪辑的周期
        this.animationClip.wrapMode = this.wrapMode;
    }

    run() {
        this.fsm.animationComponent.defaultClip = this.animationClip;
        this.fsm.animationComponent.play();
    }
}
