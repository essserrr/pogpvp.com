import React from "react"


import "./UserCard.scss"

const UserCard = React.memo(function (props) {

    console.log(props.value)

    return (
        <div className="usercard-broker row mx-0 px-2 align-items-center justify-content-between text-center">
            <div className="usercard-broker__line col-2 py-1 px-1 text-left">{props.value.Username}</div>
            <div className="usercard-broker__line col-3 px-1">{props.value.Broker.Country}</div>
            <div className="usercard-broker__line col-3 px-1">{props.value.Broker.Region}</div>
            <div className="usercard-broker__line col-2 px-1">{props.value.Broker.City}</div>
            <div className="usercard-broker__line col-1 px-1">{Object.values(props.value.Broker.Have).length}</div>
            <div className="usercard-broker__line col-1 px-1">{Object.values(props.value.Broker.Want).length}</div>
        </div>
    )
})

export default UserCard

/*
            <div className="col-12 px-1">{props.value.Broker.Contacts}</div>
            <div className="col-12 px-1">{Object.values(props.value.Broker.Have).map((value) => `${value.Name}X${value.Amount}`)}</div>
            <div className="col-12 px-1">{Object.values(props.value.Broker.Want).map((value) => `${value.Name}X${value.Amount}`)}</div>
*/