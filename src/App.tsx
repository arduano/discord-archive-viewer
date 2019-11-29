import React, { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { BrowserRouter, Link } from 'react-router-dom';
import { Redirect, Router, Route, RouteComponentProps, StaticContext, Switch } from 'react-router';
import { Category, Archive, Message, User } from './util/types';
import WebApi from './util/webapi';
import { Scroller } from './scroller/Scroller';
import ReactDOM from 'react-dom';
import Viewer from './viewer/Viewer';
import { Loader } from './util/MiscComponents';
import './armsupdatedvectorised.svg';

interface GameCardProps {
	name: string;
	thumbnail: string;
	link: string;
}

const App = () => {
	const [fadingSplash, setFadingSplash] = useState<boolean>(false);
	const [hidingSplash, setHidingSplash] = useState<boolean>(false);

	if (!fadingSplash && !hidingSplash) setTimeout(() => setFadingSplash(true), 1000);
	if (fadingSplash && !hidingSplash) setTimeout(() => setHidingSplash(true), 1000);

	return (
		<div>
			<div style={{ display: hidingSplash ? 'none' : undefined }} className={`splash ${fadingSplash ? 'fade' : ''}`}>
				<img src='/armsupdatedvectorised.svg' />
			</div>
			{!(!fadingSplash && !hidingSplash) && (
				<BrowserRouter>
					<Switch>
						<Route exact path="/" component={GameList} />
						<Route path="/game/:gid" component={GameLoader} />
					</Switch>
				</BrowserRouter>
			)}
		</div>
	)
}

function GameLoader(location: RouteComponentProps<any, StaticContext, any>) {
	const [game, setGame]: [Archive | null, any] = useState<Archive | null>(null);

	if (game == null) {
		WebApi.getGame(location.match.params.gid).then(g => setGame(g));
	}

	if (game == null) {
		return <div className="downloading"><Loader text="Downloading..."></Loader></div>
	}
	else {
		return <Viewer location={location} game={game} />;
	}
}

function GameList(location: RouteComponentProps<any, StaticContext, any>) {
	const [categories, setCategories]: [string[] | null, any] = useState<string[] | null>(null);

	if (categories == null) {
		WebApi.getCategories().then(c => setCategories(c));
	}

	return (
		<div className="categories-content">
			<Scroller>
				<div className="list-container">
					<div className="categories-list">
						{categories == null ? (
							<div>Loading...</div>
						) : (
								categories.map((c, i) => (
									<GameCard key={i} link={"game/" + encodeURI(c)} name={c} thumbnail={'url(https://i.imgur.com/T1ZPIDY.png)'} />
								))
							)}

					</div>
				</div>
			</Scroller>
		</div>
	)
}

function GameCard(props: GameCardProps) {
	return (
		<div className="game">
			<Link to={props.link}>
				<div className="game-card" style={{ backgroundImage: props.thumbnail }}>
					<div className="game-card-data">
						<div className="game-name">{props.name}</div>
					</div>
				</div>
			</Link>
		</div>
	)
}

const hashtag = (<svg width="24" height="24" viewBox="0 0 24 24" className="hashtag icon"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>)

export default App;
