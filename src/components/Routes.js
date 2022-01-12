/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Odds from "../pages/Odds";
import Bonuses from "../pages/Bonuses";
import AddBonus from "../pages/AddBonus";
import Bonus from "../pages/Bonus";
import Players from "../pages/Players";
import Player from "../pages/Player";
import Payouts from "../pages/Payouts";
import Payout from "../pages/Payout";
import Payment from "../pages/Payment";
import Contents from "../pages/Contents";
import Content from "../pages/Content";
import AddContent from "../pages/AddContent";
import Admins from "../pages/Admins";
import Notfound from "../pages/Notfound";
import Noaccess from "../pages/Noaccess";
import Exposure from "../pages/Exposure";
import GameMarket from "../pages/Games-market";
import AddPopup from "../pages/AddPopup";
import Banners from "../pages/Banners";
import Banner from "../pages/Banner";
import AddBanner from "../pages/AddBanner";
import SiteMeta from "../pages/SiteMeta";
import Transactions from "../pages/Transactions";
import Transaction from "../pages/Transaction";
import Tickets from "../pages/Tickets";
import Ticket from "../pages/Ticket";
import Notifications from "../pages/Notifications";
import Notification from "../pages/Notification";
import AddNotification from "../pages/AddNotification";
import SiteAnalyticss from "../pages/SiteAnalytics";
import Games from "../pages/Games";
import Game from "../pages/Game";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/tickets" component={Tickets} />
        <Route exact path="/ticket/:id" component={Ticket} />
        <Route exact path="/transactions" component={Transactions} />
        <Route exact path="/transaction/:id" component={Transaction} />
        <Route exact path="/payouts" component={Payouts} />
        <Route exact path="/payout/:id" component={Payout} />
        <Route exact path="/players" component={Players} />
        <Route exact path="/player/:id" component={Player} />
        <Route exact path="/admin" component={Admins} />
        <Route exact path="/notifications" component={Notifications} />
        <Route exact path="/notification/:id" component={Notification} />
        <Route exact path="/notifications/add" component={AddNotification} />
        <Route exact path="/site-meta" component={SiteMeta} />
        <Route exact path="/static-contents" component={Contents} />
        <Route exact path="/static-contents/add" component={AddContent} />
        <Route exact path="/static-content/:id" component={Content} />
        <Route exact path="/popups/add" component={AddPopup} />
        <Route exact path="/banners" component={Banners} />
        <Route exact path="/banners/add" component={AddBanner} />
        <Route exact path="/banner/:id" component={Banner} />
        <Route exact path="/payment" component={Payment} />
        <Route exact path="/exposure" component={Exposure} />
        <Route exact path="/game-market" component={GameMarket} />
        <Route exact path="/odds" component={Odds} />
        <Route exact path="/bonuses" component={Bonuses} />
        <Route exact path="/bonuses/add" component={AddBonus} />
        <Route exact path="/bonus/:id" component={Bonus} />
        <Route exact path="/site-analytics" component={SiteAnalyticss} />
        <Route exact path="/games" component={Games} />
        <Route exact path="/game/:id" component={Game} />
        <Route path="/login" component={Login} />
        <Route path="/no-access" component={Noaccess} />
        <Route component={Notfound} />
      </Switch>
    </Router>
  );
}
