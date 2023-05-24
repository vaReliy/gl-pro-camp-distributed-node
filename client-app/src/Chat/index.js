import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import socketIOClient from 'socket.io-client';

import { config } from '../config';

import MessagesList from '../MessagesList';

const H1 = styled.h1`
	position: relative;
	text-align: center;
	letter-spacing: 10px;
`;

const Status = styled.div`
	position: fixed;
	right: 20px;
	top: 20px;
	padding: 3px 10px;
	border-radius: 5px;
	font-size: 13px;
	background: ${props => (props.status === 'online' ? '#6fb472' : '#F06292')};
`;

const ChatContainer = styled.div`
	color: #fbfbef;
	font-family: "Consolas", monospace;
	display: flex;
	flex-direction: column;
	height: 100vh;
`;

const Form = styled.form`
	margin: 10px 10px 0 10px;
	display: flex;
	flex-direction: row;

	&::before {
		content: "~msg$:";
		position: absolute;
		left: 30px;
		margin-top: 11px;
		color: #dcd1c4;
		font-size: 16px;
	}
`;

const SubmitButton = styled.button`
	display: flex;
    align-items: center;
	margin-left: 10px;
	color: #dcd1c4;
    border-color: #3c4556;
    background-color: #3c4556;
    border-radius: 5px;
	font-size: 30px;
    font-weight: bold;
`;

const Input = styled.input`
	outline: none;
	border: none;
	background-color: #3c4556;
	border-radius: 5px;
	color: #ece7dc;
	width: 100%;
	height: 40px;
	text-indent: 82px;
	display: block;
	font-size: 16px;
	font-family: "Consolas", monospace;
	flex: 1;
`;

const NickName = styled.div`
	color: lightgray;
	font-size: 12px;
    margin: 0 0 10px 10px;
`;

const HighlightedSpan = styled.span`
	color: ${props => props.color};
`;

function hostName(meta, status) {
	if (meta && meta.HOSTNAME) {
		return meta.HOSTNAME;
	}
	return status || 'default';
}

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [value, setValue] = useState('');
	const [io, setIo] = useState(null);
	const [userId, setUserId] = useState(null);
	const [status, setStatus] = useState('offline');
	const [activeUsers, setActiveUsers] = useState([]);
	const el = useRef(null);
	const [meta, setMeta] = useState({});

	useEffect(() => {
		fetch(`${config.apiHost}/meta`)
			.then(resp => resp.json())
			.then(resp => setMeta(resp))
			.catch(console.error);

		const chat = socketIOClient(`${config.apiHost}/chat`);

		setIo(chat);

		chat.on('connect', () => {
			setStatus('online');
		});

		chat.on('userConnected', user => {
			setActiveUsers(u => u.concat(user));
		});

		chat.on('userDisconnected', user => {
			setActiveUsers(u => u.filter(name => name !== user));
		});

		chat.on('activeUsers', users => {
			console.info('activeUsers', users);
			setActiveUsers(() => Array.from(users));
		});

		chat.on('message', m => {
			if (m.currUserId) {
				setUserId(m.currUserId);
			}

			setMessages(d => d.concat(m));
			if (el.current) {
				el.current.scrollTop = el.current.scrollHeight;
			}
		});

		return () => chat.disconnect();
	}, []);

	return (
		<ChatContainer>
			<Status status={status}>{hostName(meta, status)}</Status>
			<H1>Chat App</H1>
			<MessagesList
				el={el}
				messages={messages}
				userId={userId}
				activeUsers={activeUsers}
			/>
			<Form
				username={userId}
				onSubmit={e => {
					e.preventDefault();
					if (value !== '') {
						io.emit('message', value);
						setValue('');
					}
				}}
				>
				<Input
					value={value}
					onChange={e => setValue(e.target.value)}
					placeholder={`Enter your message as ${userId}`}
				/>
				<SubmitButton type="submit">↵</SubmitButton>
			</Form>
			<NickName>Your username:
				<HighlightedSpan color="lightblue">{userId}</HighlightedSpan>
			</NickName>
		</ChatContainer>
	);
};

export default Chat;
