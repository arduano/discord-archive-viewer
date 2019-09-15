import { Switch, RouteComponentProps, StaticContext, Route, withRouter } from "react-router";
import React, { useState } from "react";
import { Scroller } from "../scroller/Scroller";
import { Link } from "react-router-dom";
import { Archive, Channel } from "../util/types";
import './ChannelList.scss';
import { any } from "prop-types";

const hashtag = (<svg width="24" height="24" viewBox="0 0 24 24" className="hashtag icon"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>)

type ChannelListProps = { location: RouteComponentProps<any, StaticContext, any>, game: Archive };

export default class ChannelList extends React.PureComponent<ChannelListProps, { open: boolean[] }> {
	constructor(props: ChannelListProps) {
		super(props);
		this.state = { open: this.props.game.categories.map(c => false) };
		this.ChannelListSelection = this.ChannelListSelection.bind(this);
	}

	ChannelListSelection(prps: RouteComponentProps<any, StaticContext, any>) {
		return (
			<div className="channel-list-container">
				<Scroller>
					{this.props.game.categories.map((c, i) =>
						<Category
							open={this.state.open[i]}
							toggleOpen={() => {
								this.state.open[i] = !this.state.open[i];
								this.setState({ open: this.state.open.map(o => o) });
							}}
							key={i}
							name={c.name.toUpperCase()}
							id={c.id}
							channels={this.props.game.channels.filter(_c => _c.parentID == c.id)}
							location={prps} />
					)}
				</Scroller>
			</div>
		)
	}

	shouldComponentUpdate(nextProps: Readonly<ChannelListProps>, nextState: Readonly<{ open: boolean[] }>, nextContext: any){
		if(nextState.open != this.state.open) return true;
		return false;
	}

	render() {
		return (
			<Switch>
				<Route exact path={this.props.location.match.path} component={this.ChannelListSelection} />
				<Route exact path={this.props.location.match.path + '/:cid'} component={this.ChannelListSelection} />
			</Switch>
		)
	}
}

// function Category(props: { open: boolean, toggleOpen: () => void, id: string, name: string, channels: Channel[], location: RouteComponentProps<any, StaticContext, any> }) {
// 	let channel = props.channels.find(c => c.name == props.location.match.params.cid);

// 	return (
// 		<div className="category-container">
// 			<div className="category-line" onClick={() => props.toggleOpen()}>
// 				<div className="material-icons">{props.open ? "keyboard_arrow_down" : "keyboard_arrow_right"}</div>
// 				<div>{props.name}</div>
// 			</div>
// 			<div className={`${props.open ? '' : 'collapsed'}`}>
// 				{props.channels.sort((a, b) => a.position - b.position).map((c, i) => (
// 					<Link to={'/game/' + props.location.match.params.gid + '/' + c.name}>
// 						<div className={`channel-link ${channel != null && c.name == channel.name ? 'selected' : ''}`}>
// 							<div className="channel-hashtag">{hashtag}</div><div className="channel-name">{c.name}</div>
// 						</div>
// 					</Link>
// 				))}
// 			</div>
// 		</div>
// 	)
//}

type CategoryProps = { open: boolean, toggleOpen: () => void, id: string, name: string, channels: Channel[], location: RouteComponentProps<any, StaticContext, any> };

class Category extends React.PureComponent<CategoryProps, {}> {
	constructor(props: CategoryProps) {
		super(props);
	}

	shouldComponentUpdate(nextProps: Readonly<CategoryProps>, nextState: Readonly<{}>, nextContext: any) {
		if (nextProps.location.match.params.cid != this.props.location.match.params.cid) return true;
		if (nextProps.open != this.props.open) return true;
		return false;
	}

	render() {
		let channel = this.props.channels.find(c => c.name == this.props.location.match.params.cid);

		return (
			<div className="category-container">
				<div className="category-line" onClick={() => this.props.toggleOpen()}>
					<div className="material-icons">{this.props.open ? "keyboard_arrow_down" : "keyboard_arrow_right"}</div>
					<div>{this.props.name}</div>
				</div>
				<div className={`${this.props.open ? '' : 'collapsed'}`}>
					{this.props.channels.sort((a, b) => a.position - b.position).map((c, i) => (
						<Link to={'/game/' + this.props.location.match.params.gid + '/' + c.name}>
							<div className={`channel-link ${channel != null && c.name == channel.name ? 'selected' : ''}`}>
								<div className="channel-hashtag">{hashtag}</div><div className="channel-name">{c.name}</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		)
	}
}