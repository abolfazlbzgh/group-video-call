import React, { useState } from 'react';
import Input from '../components/Input';
import Frame from '../components/Frame';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function Home() {

    const [isClickOnSubmit, setIsClickOnSubmit] = useState(false);
    const [isShowMessageError, setIsShowMessageError] = useState(false);
    const [messageTextError, setMessageTextError] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const navigate = useNavigate();

    const createMeeting = () => {
        const link = window.location.origin + `/join/${generateRandomString(8)}`;
        setMeetingLink(link);
    };
    function generateRandomString(length) {
        return Math.random().toString(36).substring(2, 2 + length);
    }
    const joinMeeting = () => {
        setIsClickOnSubmit(true);
        setIsShowMessageError(false);
        if (!validateLink(meetingLink)) {
            setIsShowMessageError(true);
            setMessageTextError('Please enter correct link')
            return;
        }
        navigate(meetingLink.substring(meetingLink.indexOf("/join/")));
    };

    function validateLink(link) {
        const regex = /^(http:\/\/|https:\/\/)([a-zA-Z0-9.-]+|\d{1,3}(\.\d{1,3}){3}):\d{1,5}\/join\/[a-zA-Z0-9]{8}$/;
        return regex.test(link);
    }

    return (
        <Frame src="../home.svg" title="VideoCall" isSmallImg={true} isShowBrand={true}>

            <div className='flex flex-col justify-start items-center mt-8 gap-3 w-full'>
                <Input
                    label='Meeting link'
                    type="text"
                    value={meetingLink}
                    onChange={setMeetingLink}
                    placeholder='Enter your meeting link'
                    isClickOnSubmit={isClickOnSubmit}
                    isShowMessageError={isShowMessageError}
                    messageTextError={messageTextError}
                />

                <Button
                    title={'Create Meeting Link'}
                    onClick={createMeeting}
                    disabled={false}
                />
                <Button
                    title={'Copy Link'}
                    onClick={() => navigator.clipboard.writeText(meetingLink)}
                    disabled={meetingLink.length > 7 ? false : true}
                />
                <Button
                    title={'Join to Meeting'}
                    onClick={joinMeeting}
                    disabled={meetingLink.length > 7 ? false : true}
                />
            </div>
        </Frame>
    )
}
