import React, { useState } from "react";
import { ToastProvider, useToasts } from "react-toast-notifications";
import MD5 from "md5";
import Heading from "../../components";
import AdminPageComponent from "../../components/Admin";
import { ADMIN_USER_NAME, ADMIN_USER_PASSWORD } from "../../constants";
import "./style.css";

const AdminPageForms = () => {
    const [adminStatus, setAdminStatus] = useState(false);
    const [userInfo, setUserInfo] = useState({ username: '', userpwd: '' });
    const { addToast } = useToasts();
    const handleUserInfo = (event, key) => {
        if (key === 'username') {
            setUserInfo({ username: event.target.value, userpwd: userInfo.userpwd });
        } else {
            setUserInfo({ username: userInfo.username, userpwd: event.target.value });
        }
    }
    const handleAdminStatus = () => {
        if (userInfo.username !== '' && userInfo.username === ADMIN_USER_NAME) {
            if (userInfo.userpwd !== '' && MD5(userInfo.userpwd) === ADMIN_USER_PASSWORD) {
                addToast("Login Successfully!", { appearance: "success" });
                setAdminStatus(true);
            } else {
                addToast("Login Failed!", { appearance: "error" });
            }
        } else {
            addToast("Login Failed!", { appearance: "error" });
        }
    }
    const handleAdminStatusByKey = (event) => {
        if (event.key === 'Enter')
            if (userInfo.username !== '' && userInfo.username === ADMIN_USER_NAME) {
                if (userInfo.userpwd !== '' && MD5(userInfo.userpwd) === ADMIN_USER_PASSWORD) {
                    addToast("Login Successfully!", { appearance: "success" });
                    setAdminStatus(true);
                } else {
                    addToast("Login Failed!", { appearance: "error" });
                }
            } else {
                addToast("Login Failed!", { appearance: "error" });
            }
    }
    return (
        <div  style={{ textAlign: 'center' , marginTop : '5.5em' }}>
            <Heading title={'_admin'} />
            {
                adminStatus ?
                    <AdminPageComponent />
                    :
                    <div className="admin-login-page-container">
                        <input type='text' placeholder='email...' className='admin-info-input' onChange={(e) => handleUserInfo(e, 'username')} onKeyDown={(e) => { handleAdminStatusByKey(e) }} />
                        <input type='password' placeholder='password...' className='admin-info-input' onChange={(e) => handleUserInfo(e, 'userpwd')} onKeyDown={(e) => { handleAdminStatusByKey(e) }} />
                        <button className='main-button' onClick={() => handleAdminStatus()}>login</button>
                    </div>
            }

        </div>
    );
};

const AdminPage = () => (
    <ToastProvider autoDismiss={true} autoDismissTimeout="2000">
        <AdminPageForms />
    </ToastProvider>
);

export default AdminPage;
