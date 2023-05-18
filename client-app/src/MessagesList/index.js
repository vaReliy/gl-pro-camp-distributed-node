import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const getColor = (enabled, specialColor, defaultColor) => {
	if (enabled) {
		return specialColor;
	}
	return defaultColor;
};

const Welcome = styled.div`
	position: relative;
	font-size: 12px;
	color: gray;
`;

const WelcomePart  =styled.span`
	color: ${props => props.isDecorated ? 'lightgray' : 'gray'};
	font-weight: ${props => props.isDecorated ? 'bold' : 'normal'};
`;

const ChatMessagesList = styled.ul`
	flex: 1;
	margin: 0;
	padding: 20px;
	overflow-y: scroll;
	list-style-type: none;	
`;

const ChatMessage = styled.li`
	margin-left: ${props => props.currentUser ? '5rem' : '0'};
	width: calc(100% - ${props => props.currentUser ? '0' : '5rem'});
`;

const Message = styled.div`
	position: relative;
	padding: 10px 20px;
	border-radius: 4px;
	color: #afeaa1;
	overflow-wrap: break-word;
	background: ${props => getColor(props.currentUser, '#3c4556', '#2f313d')};
`;

const FlexRowEnd = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`;

const Time = styled.span`
	margin-right: 5px;
	font-weight: 600;
	font-size: 12px;
	color: #dcd1c4;
`;

const Name = styled.span`
	display: inline-block;
	position: relative;
	font-weight: 600;
	font-style: italic;
	font-size: 12px;
	color: ${props => getColor(props.isOnline, '#f4f2e7', 'grey')};

	&::after {
		content: '';
		position: absolute;
		top: 2px;
		right: -14px;
		width: 10px;
		height: 10px;
		border-radius: 10px;
		background: ${props => !props.currentUser ? getColor(props.isOnline, '#6fb472', 'grey') : 'none'};
	}
`;


function MessagesList(props) {
	const splittedMessageItems = ({msg, currUserId}) => {
		const regex = new RegExp(`(\\b${currUserId}\\b)`, 'i');
		return msg.split(regex);
	};

	return (
		<ChatMessagesList ref={props.el}>
			{ props.messages.map((m, i) => {
				if (!m.user) {
					return (<Welcome key={i}>{
						splittedMessageItems(m).map((item, i) => {
							return (<WelcomePart
										isDecorated={m.currUserId === item}
										key={i}>
										{item}
									</WelcomePart>
									);
						})
					}</Welcome>);
				}
				const isOnline = props.activeUsers.includes(m.user);
				const isSender = props.userId === m.user;
				return (
					<ChatMessage key={i + m.user} currentUser={isSender}>
						<Name isOnline={isOnline} currentUser={isSender}>{!isSender ? m.user : ''}</Name>
						<Message currentUser={isSender}>{m.msg}</Message>
						<FlexRowEnd>
							<Time>{m.time}</Time>
						</FlexRowEnd>
					</ChatMessage>
				);
			})}
		</ChatMessagesList>
	);
}

MessagesList.propTypes = {
	el: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.object
	]),
	userId: PropTypes.string,
	messages: PropTypes.arrayOf(PropTypes.object),
};

export default MessagesList;
