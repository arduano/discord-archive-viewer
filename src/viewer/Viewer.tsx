import React, { useState } from "react";
import { Redirect, RouteComponentProps, StaticContext, Switch, Route } from "react-router";
import { Archive, Message, User, Attachment } from "../util/types";
import WebApi from "../util/webapi";
import { Link } from "react-router-dom";
import { Scroller } from "../scroller/Scroller";
import ReactDOM from "react-dom";
import ChannelList from "../channel-list/ChannelList";
import { Loader, MissingPFP } from '../util/MiscComponents';
import './Viewer.scss';

const hashtag = (<svg width="24" height="24" viewBox="0 0 24 24" className="hashtag icon"><path fill="currentColor" fillRule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>)
const peopleIcon = (<svg className="people icon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" clip-rule="evenodd" d="M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z"></path><path fill="currentColor" fillRule="evenodd" clip-rule="evenodd" d="M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z"></path><path fill="currentColor" d="M20.0001 20.006H22.0001V19.006C22.0001 16.4433 20.2697 14.4415 17.5213 13.5352C19.0621 14.9127 20.0001 16.8059 20.0001 19.006V20.006Z"></path><path fill="currentColor" d="M14.8834 11.9077C16.6657 11.5044 18.0001 9.9077 18.0001 8.00598C18.0001 5.96916 16.4693 4.28218 14.4971 4.0367C15.4322 5.09511 16.0001 6.48524 16.0001 8.00598C16.0001 9.44888 15.4889 10.7742 14.6378 11.8102C14.7203 11.8418 14.8022 11.8743 14.8834 11.9077Z"></path></svg>)

function add0(s: string) {
	s = s.toString();
	if (s.length == 1) return '0' + s;
	return s;
}

function MessageGroup(props: { messages: Message[], users: any }) {
	const getDateString = (d: Date) => {
		d = new Date(d);
		return d.getDay() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + add0(d.getMinutes().toString()) + ":" + add0(d.getSeconds().toString())
	}

	function MessageLine(props: { text: string, attachments?: Attachment[] }) {
		return (
			<div className="message-line">
				<div>
					<FormattedText text={props.text} />
				</div>
				{props.attachments != null && props.attachments.length != 0 && (props.attachments.map((a, i) => (
					<div key={i} className="attachment">
						<img src={a.id} />
					</div>
				)))}
			</div>
		)
	}

	return (
		<div className="message-container">
			<hr className="separator"></hr>
			{props.messages.map((m, i) => {
				if (i == 0) {
					let u = (props.users[m.user] as User);
					return (
						<div className="first-message" key={i}>
							<div className="pfp-and-name">
								<div className="pfp">
									{u._tid != null ? (
										<img src={WebApi.tidUrl(u._tid!)} />
									) : (
											<MissingPFP size={20} />
										)}
								</div>
								<div className="username">
									<span className="name" style={{ color: u.display_hex_colour }}>
										{u.display_name != null ? u.display_name : u.username}
									</span>
									<span className="message-time">{getDateString(new Date(m.createdTimestamp))}</span>
								</div>
							</div>
							<MessageLine text={m.content} attachments={m.attachments} />
						</div>
					)
				}
				else {
					return <MessageLine text={m.content} attachments={m.attachments} key={i} />
				}
			})}
		</div>
	)
}

function Viewer(props: { location: RouteComponentProps<any, StaticContext, any>, game: Archive }) {
	function MsgView(prps: RouteComponentProps<any, StaticContext, any>) {
		if (localStorage.getItem('show-users') == null) localStorage.setItem('show-users', 'false');
		const [showingUsers, setShowingUsers] = useState<boolean>(localStorage.getItem('show-users') == 'true');
		if (showingUsers && localStorage.getItem('show-users') != 'true') localStorage.setItem('show-users', 'true');
		if (!showingUsers && localStorage.getItem('show-users') == 'true') localStorage.setItem('show-users', 'false');

		let channel = props.game.channels.find(c => c.name == prps.match.params.cid);
		if (channel == null) return <Redirect to={props.location.match.url} />

		let msgs: Message[][] = []
		let lastmsg: Message | null = null;
		let msgGroup: Message[] = [];
		channel.messages.forEach(msg => {
			if (lastmsg == null) lastmsg = msg;
			if (lastmsg.user != msg.user ||
				lastmsg.createdTimestamp + 10 * 60000 < msg.createdTimestamp) {
				msgs.push(msgGroup);
				msgGroup = [];
			}
			lastmsg = msg;
			msgGroup.push(msg);
		});
		msgGroup.reverse();
		msgs.push(msgGroup);

		let users: any = {}
		props.game.users.forEach(u => users[u.id] = u);

		return (
			<div className="right-side">
				<div className="top-bar">
					<div className="channel-title">
						<div className="channel-hashtag">{hashtag}</div>
						<div className="channel-name"><span>{channel.name}</span></div>
					</div>
					<div className="flex-space"></div>
					<div onClick={() => setShowingUsers(!showingUsers)} className={`people-icon ${showingUsers ? 'selected' : ''}`}>{peopleIcon}</div>
				</div>
				<div className="right-content">
					<div className="messages-container" ref={
						e => {
							if (e != null) {
								setTimeout(async () => {
									let list = msgs.map((m, i) => <MessageGroup messages={m} users={users} key={i} />);
									ReactDOM.render((
										<Scroller>
											<div className="messages-list">
												<div>
													{list}
												</div>
											</div>
										</Scroller>
									), e);
								}, 100);
							}
						}
					}>
						<Loader text="Rendering..." />
					</div>
					{showingUsers && (
						<div className="users-list">
							<Scroller>
								<div className="users-title">{'USERS—' + props.game.users.length}</div>
								{props.game.users.map((u, i) => {
									return (
										<div className="user-container" key={i}>
											{u._tid != null ? (
												<img src={WebApi.tidUrl(u._tid!)} />
											) : (
													<MissingPFP size={15} />
												)}
											<div style={{ color: u.display_hex_colour }} className="username">{u.display_name}</div>
										</div>
									)
								})}
							</Scroller>
						</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className="content">
			<div className="left-side">
				<div className="top-bar">
					<Link to="/">
						<div className="back-link-container">
							<div className="material-icons">arrow_back</div>
							<div className="back-text">Back</div>
						</div>
					</Link>
				</div>
				<ChannelList location={props.location} game={props.game} />
			</div>
			<Switch>
				<Route exact path={props.location.match.path} component={() => <Redirect to={props.location.match.url + "/" + props.game.channels[0].name} />} />
				<Route exact path={props.location.match.path + '/:cid'} component={MsgView} />
			</Switch>
		</div>
	)
}

interface TextStyles {
	italic: boolean,
	bold: boolean,
	underline: boolean,
	strikeout: boolean
}

function FormattedText(props: { text: string, styles?: TextStyles }) {
	let text = props.text;
	let styles: TextStyles;
	if (props.styles == null) styles = {
		italic: false,
		bold: false,
		underline: false,
		strikeout: false,
	}
	else styles = props.styles;
	if (!text.match(/.*[*~`_\|].*/)) {
		return <span>{text}</span>
	}
	else {
		let data: any[] = []
		while (text.length != 0) {
			let matches = [
				{ match: /```(?<content>(.|\n)+?)```/, name: 'big code' },
				{ match: /`(?<content>(.|\n)+?)`/, name: 'code' },
				{ match: /\|\|(?<content>(.|\n)+?)\|\|/, name: 'spoiler' },
			];
			if (!styles.bold) matches.push({ match: /\*\*(?<content>(.|\n)+?)\*\*/, name: 'bold' });
			if (!styles.italic) matches.push({ match: /\*(?<content>(.|\n)+?)\*/, name: 'italic' });
			if (!styles.underline) matches.push({ match: /__(?<content>(.|\n)+?)__/, name: 'underline' });
			if (!styles.italic) matches.push({ match: /_(?<content>(.|\n)+?)_/, name: 'italic' });
			if (!styles.strikeout) matches.push({ match: /~~(?<content>(.|\n)+?)~~/, name: 'strikeout' });
			let first: any = null;
			let firstMatch: string = '';
			matches.forEach(s => {
				let match = text.match(s.match);
				if (text.includes('||')) console.log('spoiler', match);
				if (match == null) return;
				if (match.index == null) return;
				if (first == null || match.index < first.index!) {
					first = match;
					firstMatch = s.name;
				}
			});
			if (first == null) break;
			if (first.index != 0) {
				data.push(text.substr(0, first.index));
				text = text.substring(first.index);
			}
			let _styles = { ...styles };
			(_styles as any)[firstMatch] = true;
			if (firstMatch == 'spoiler') console.log("Spoiler", first[1])
			if (firstMatch == 'big code')
				data.push(<code key={data.length} className="big-code"><span>{first[1]}</span></code>)
			else if (firstMatch == 'code')
				data.push(<code key={data.length}>{first[1]}</code>)
			else if (firstMatch == 'strikeout')
				data.push(<s key={data.length}><FormattedText text={first[1]} styles={_styles} /></s>)
			else if (firstMatch == 'bold')
				data.push(<strong key={data.length}><FormattedText text={first[1]} styles={_styles} /></strong>)
			else if (firstMatch == 'italic')
				data.push(<i key={data.length}><FormattedText text={first[1]} styles={_styles} /></i>)
			else if (firstMatch == 'underline')
				data.push(<u key={data.length}><FormattedText text={first[1]} styles={_styles} /></u>)
			else if (firstMatch == 'spoiler')
				data.push(<Spoiler key={data.length}><FormattedText text={first[1]} styles={_styles} /></Spoiler>)
			else data.push(first[1]);
			text = text.substr(first[0].length);
		}
		data.push(text);
		return data as any;
	}
}

function Spoiler(props: { children: any }) {
	const [hidden, setHidden] = useState<boolean>(true);
	return <span onClick={() => setHidden(false)} className={`spoiler ${hidden ? 'hidden' : ``}`}>{props.children}</span>
}

export default Viewer;
