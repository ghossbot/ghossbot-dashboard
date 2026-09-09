* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

body {
    background: #08080c;
    color: white;
    min-height: 100vh;
}

.sidebar {
    position: fixed;
    width: 250px;
    height: 100vh;
    background: #101015;
    border-right: 1px solid #25252e;
    padding: 25px 15px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;
}

.logo-icon {
    width: 45px;
    height: 45px;
    border-radius: 12px;
    background: linear-gradient(135deg, #ff176f, #ff0050);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 23px;
    font-weight: bold;
}

.logo h1 {
    font-size: 20px;
}

.logo span {
    color: #777;
    font-size: 12px;
}

.menu {
    width: 100%;
    padding: 14px;
    margin-bottom: 7px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: #aaa;
    text-align: left;
    font-size: 15px;
    cursor: pointer;
}

.menu span {
    margin-left: 10px;
}

.menu:hover,
.menu.active {
    background: #24131c;
    color: #ff2775;
}

main {
    margin-left: 250px;
    padding: 35px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

header h2 {
    font-size: 29px;
}

header p {
    color: #777;
    margin-top: 5px;
}

#loginButton {
    background: #ff2775;
    color: white;
    border: 0;
    padding: 13px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}

.cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
}

.card {
    background: #141419;
    border: 1px solid #282831;
    border-radius: 12px;
    padding: 22px;
}

.card span {
    color: #888;
    display: block;
    margin-bottom: 13px;
}

.card strong {
    font-size: 25px;
}

.online {
    color: #4be28a;
}

.panel {
    margin-top: 25px;
    background: #141419;
    border: 1px solid #282831;
    border-radius: 12px;
    padding: 25px;
}

.panel h3 {
    margin-bottom: 20px;
}

.setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 0;
    border-bottom: 1px solid #282831;
}

.setting p {
    color: #777;
    font-size: 13px;
    margin-top: 5px;
}

.switch {
    width: 48px;
    height: 25px;
    border: 0;
    border-radius: 20px;
    background: #333;
    position: relative;
    cursor: pointer;
}

.switch::after {
    content: "";
    position: absolute;
    width: 19px;
    height: 19px;
    background: white;
    border-radius: 50%;
    top: 3px;
    left: 4px;
    transition: .2s;
}

.switch.on {
    background: #ff2775;
}

.switch.on::after {
    left: 25px;
}

.save {
    margin-top: 20px;
    padding: 12px 20px;
    background: #ff2775;
    color: white;
    border: 0;
    border-radius: 7px;
    font-weight: bold;
}

@media(max-width:800px) {

    .sidebar {
        width: 70px;
        padding: 20px 8px;
    }

    .logo div:not(.logo-icon) {
        display: none;
    }

    .menu span {
        display: none;
    }

    .menu {
        text-align: center;
    }

    main {
        margin-left: 70px;
        padding: 20px;
    }

    .cards {
        grid-template-columns: 1fr;
    }

    header {
        gap: 15px;
    }

    header h2 {
        font-size: 22px;
    }

}
