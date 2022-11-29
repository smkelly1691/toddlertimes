import { useState, useEffect, useRef } from "react";
import './NewPlanPage.css'
import * as activitiesAPI from '../../utilities/activities-api';
import * as activityPlansAPI from '../../utilities/activityPlans-api';
import UserDetail from "../../components/UserDetail/UserDetail";
import Logo from "../../components/Logo/Logo";
import ActivityPlanList from "../../components/ActivityPlanList/ActivityPlanList";
import CategoryList from "../../components/CategoryList/CategoryList";
import ActivityList from "../../components/ActivityList/ActivityList";
import UserLogOut from "../../components/UserLogOut/UserLogOut";
import NavBar from "../../components/NavBar/NavBar";

export default function NewPlanPage({ user, setUser }) {
    const [planItems, setPlanItems] = useState([]);
    const [activeCat, setActiveCat] = useState('');
    const [myplan, setMyplan] = useState(null);
    const categoriesRef = useRef([]);

    useEffect(function() {
        async function getActivities() {
            const activities = await activitiesAPI.getAll();
            categoriesRef.current = [...new Set(activities.map(activity => activity.category.name))];
            setPlanItems(activities);
            setActiveCat(categoriesRef.current[0])
        };
        getActivities();

        async function getMyplan() {
            const myplan = await activityPlansAPI.getMyplan();
            setMyplan(myplan);
        };
        getMyplan();
    }, [])

    //Event Handlers
    async function handleAddToPlan(activityId) {
        const updatedPlan = await activityPlansAPI.addActivityToPlan(activityId)
        setMyplan(updatedPlan)
    }

    return (
        <main className="NewPlanPage">
            <header>
                <UserDetail user={user} />
                <Logo />
                <UserLogOut user={user} setUser={setUser} />
            </header>
            <div className="body">
                <aside>
                    <CategoryList 
                        categories={categoriesRef.current}
                        activeCat={activeCat}
                        setActiveCat={setActiveCat}
                    />
                    <NavBar />
                </aside>
                <div className="activity-list">
                    <h2>{activeCat} Activities</h2>
                    <ActivityList
                        planItems={planItems.filter(activity => activity.category.name === activeCat)}
                        handleAddToPlan={handleAddToPlan} 
                    />
                </div>
                <div>
                <ActivityPlanList activityPlan={myplan} />
                </div>
            </div>
            <footer>
                <span>Toddler Time</span>
                <span>© 2022 | Powered by React | All Rights Reserved</span>
            </footer>
        </main>
    );
}