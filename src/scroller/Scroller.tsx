import React, { RefObject } from "react";
import './Scroller.scss';

type scrollerState = {
    cancelWidth: number,
    headSize: number,
    topSize: number,
    bottomSize: number,
    headHeight: number,
    scrollTop: number,
    internal: number,
    external: number,
    scrollHidden: boolean,
    dragging: boolean
};

export class Scroller extends React.Component<{}, scrollerState>{

    constructor(props: any) {
        super(props);
        this.scrollChild = React.createRef();
        this.scrollParent = React.createRef();
        this.state = {
            cancelWidth: 0,
            headSize: 0,
            topSize: 0,
            bottomSize: 0,
            headHeight: 0,
            scrollTop: 0,
            internal: 0,
            external: 0,
            scrollHidden: true,
            dragging: false
        };
    }

    scrollChild: RefObject<HTMLDivElement>;
    scrollParent: RefObject<HTMLDivElement>;

    dragStartPos: number = 0;
    dragHeadStartPos: number = 0;

    updateLoop: number = 0;

    componentDidMount() {
        if (this.scrollChild.current != null) {
            this.updateScroll(this);

            this.setCancelWidth(this);

            window.setTimeout(() => {
                this.updateScroll(this);
                this.updateLoop = window.setInterval(() => this.updateScroll(this), 100);
            }, 1000)
            window.onmouseup = () => { this.setState({ dragging: false }) }
            window.onmousemove = (a: any) => { this.headDrag(a, this) }
            window.onresize = () => this.setCancelWidth(this);

        }
    }

    setCancelWidth(_: any) {
        if (this.scrollChild.current != null) {
            this.setState({ cancelWidth: (this.scrollChild.current.offsetWidth - this.scrollChild.current.clientWidth) })
        }
    }

    componentWillUnmount() {
        window.clearInterval(this.updateLoop);
    }

    render() {
        return (
            <div className={`scrollable ${this.state.dragging ? 'dragging' : ''}`}>
                <div ref={this.scrollParent} className="scroll-parent" onScroll={() => this.updateScroll(this)}>
                    <div ref={this.scrollChild} className="scroll-child" style={{ paddingRight: this.state.cancelWidth + 1 + 'px' }}>
                        <div style={{ marginRight: -this.state.cancelWidth + 'px', minHeight: "100%" }}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <div className={`scroll-bar ${this.state.scrollHidden ? 'hidden' : ''}`}>
                    <div className="floater-top" style={{ height: this.state.topSize + '%' }}></div>
                    <div className={`scroll-head ${this.state.dragging ? 'dragging' : ''}`} style={{ height: this.state.headSize + '%' }} onMouseDown={(e) => this.dragStart(e, this)}>
                        <div className="smooth-fade">
                            <div className="scroll-highlight"></div>
                        </div>
                    </div>
                    <div className="floater-bottom" style={{ height: this.state.bottomSize + '%' }}></div>
                </div>
            </div >
        )
    }

    dragStart(e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent, _: any) {
        if (!this.state.dragging && this.scrollParent.current != null && this.scrollChild.current != null) {
            this.dragStartPos = e.clientY;
            this.dragHeadStartPos = this.state.scrollTop / (this.state.internal - this.state.external);
            this.setState({ dragging: true });
            //this.scrollChild.current.setPointerCapture();
        }
    }

    headDrag(e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent, _: any) {
        if (this.state.dragging && this.scrollParent.current != null && this.scrollChild.current != null) {
            let drag = (this.dragStartPos - e.clientY) / (this.scrollParent.current.clientHeight * (1 - this.state.headHeight));
            this.scrollChild.current.scrollTop = (this.dragHeadStartPos - drag) * (this.state.internal - this.state.external);
        }
    }

    updateScroll(_: any) {
        if (this.scrollChild.current != null && this.scrollParent.current != null) {
            let state = this.state as any;

            state.external = this.scrollChild.current.clientHeight;
            let s = window.getComputedStyle(this.scrollChild.current.children[0]);
            let margin = parseFloat(s.marginTop == null ? '0' : s.marginTop) + parseFloat(s.marginBottom == null ? '0' : s.marginBottom);
            state.internal = this.scrollChild.current.children[0].clientHeight + margin;
            state.headHeight = Math.max(state.external / state.internal, 0.1);
            state.scrollHidden = state.internal <= state.external;
            state.scrollTop = this.scrollChild.current.scrollTop;
            let scroll = state.scrollTop / (state.internal - state.external);
            let top = scroll;
            let bottom = 1 - scroll;
            state.topSize = top * (1 - state.headHeight) * 100;
            state.topSize = state.topSize < 0 ? 0 : state.topSize;
            state.bottomSize = bottom * (1 - state.headHeight) * 100;
            state.bottomSize = state.bottomSize < 0 ? 0 : state.bottomSize;
            state.headSize = state.headHeight * 100;

            this.setState(state);
        }
    }
}