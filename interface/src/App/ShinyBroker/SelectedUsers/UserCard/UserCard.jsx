import React from "react"


import "./UserCard.scss"

const UserCard = React.memo(function (props) {

    console.log(props.value)

    return (
        <div className="ushinycard row my-1 mx-1 align-items-center">
            <div className="col-auto px-0">{props.value.Username}</div>
            <div className="col-auto px-0">{props.value.Broker.Country}</div>
            <div className="col-auto px-0">{props.value.Broker.Region}</div>
            <div className="col-auto px-0">{props.value.Broker.City}</div>
            <div className="col-auto px-0">{props.value.Broker.Contacts}</div>
            <div className="col-12 px-0">{Object.values(props.value.Broker.Have).map((value) => `${value.Name}X${value.Amount}`)}</div>
            <div className="col-12 px-0">{Object.values(props.value.Broker.Want).map((value) => `${value.Name}X${value.Amount}`)}</div>
        </div>
    )
})

export default UserCard
