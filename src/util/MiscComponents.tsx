import React from "react";
import './MiscComponents.scss';

export function Loader(props: { text: string }) {
	return (
		<div className="fill">
			<div className="loader-container">
				<div className="loader"></div>
				<div className="loader-text">{props.text}</div>
			</div>
		</div>
	)
}

export function MissingPFP(props: { size: number }) {
	return (
		<div className="missing-pfp">
			<div style={{fontSize: props.size}}>?</div>
		</div>
	)
}