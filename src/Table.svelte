<script>
    import { FalsityScores } from "./falsity_scores.js";
    import InfiniteScroll from "svelte-infinite-scroll";
    import jQuery from "jquery";

    export let following;
    export let username;
    export let follow_n;

    sessionStorage.setItem("unfollows", "");
    const userurl = "https://www.twitter.com/" + username;

    FalsityScores.forEach((obj, i) => {
        FalsityScores[i].elite_account = obj.elite_account.toLowerCase();
    });

    const getFalsityScore = (elite_account) => {
        const obj = FalsityScores.filter(
            (obj) => obj.elite_account === elite_account.toLowerCase()
        );
        let score = NaN;
        if (obj.length > 0) {
            score = Number(obj[0].falsity_score).toFixed(3);
        }
        return score;
    };

    const gradeFromScore = (score) => {
        if (score < 25) {
            return "Frequently Dishonest";
        }
        if (score < 50) {
            return "Sometimes Dishonest";
        }
        if (score < 75) {
            return "Occasionally Dishonest";
        }
        return "Very Rarely Dishonest";
    };

    let data = [];
    following.forEach((val, i) => {
        data.push({
            i: i + 1,
            Elite:
                "<a href='https://twitter.com/" +
                val +
                "' target='_blank' class='profile-link'>" +
                "@" + val +
                "</a>",
            FalsityScore: getFalsityScore(val),
        });
    });
    // sort values
    data = data.sort((a, b) => (a.FalsityScore > b.FalsityScore ? -1 : 1));
    // reset i values in data
    data.forEach((val, i) => {
        data[i].i = i + 1;
    });
    console.log("Test 1");
    let page = 0;
    let size = 10000;
    let elites = [];
    $: elites = [...elites, ...data.splice(size * page, size * (page + 1) - 1)];
    jQuery(document).ready(function () {
        console.log("Jquery loaded.");
        jQuery("button").click(function () {
            jQuery(this).before("<p class='uftext'>Unfollowed!</p>");
            sessionStorage.setItem("unfollows",sessionStorage.getItem("unfollows")+jQuery(this).closest("tr").children().children()[0].innerText+";");
            jQuery(this).remove();
            console.log(sessionStorage.getItem("unfollows"));
        });
    });

</script>

<main>
    {#if follow_n > 1}
        <p class="center-text">
            Here's a review of the {follow_n} political accounts
            <strong>
                <a href={userurl} target="_blank" rel="noreferrer" style="color: #63d2ff">
                    {username}</a>
            </strong>
            follows.
        </p>
    {:else}
        <p class="center-text">
            Here's a review of the political account
            <strong>
                <a href={userurl} target="_blank" style="color: #63d2ff">
                    {username}
                </a>
            </strong>
            follows.
        </p>{/if}
    <div class="center">
        <table>
            <tr style="background-color:#94adc4">
                <th>Political Account</th>
                <th>Misinformation Rating</th>
                <th>Action</th>
            </tr>

            {#each elites as elite}
                <tr class="following">
                    <td>{@html elite.Elite}<br></td>
                    <td>
                        {gradeFromScore(100 * (1 - elite.FalsityScore))}<br />
                        <div id="progress-bar" class="all-rounded">
                            <div id="progress-bar-percentage" class={"all-rounded "+gradeFromScore(100 * (1 - elite.FalsityScore))} style={"width:"+(20+100*(1- elite.FalsityScore))+"%"}><span></span></div>
                        </div>
                    </td>
                    <td>
                        <button class="uButton">Unfollow</button>
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</main>

<style>
    strong {
        color: #63d2ff;
        font-weight: 600px;
    }
    .center {
        margin-left: auto;
        margin-right: auto;
    }
    .center-text {
        text-align: center;
    }
    div {
        overflow-x: hidden;
    }
    table {
        border: 1px solid #94adc4;
        border-collapse: collapse;
        font-size: 13px;
        line-height: 1rem;
        margin: auto;
    }
    th {
        text-align: center;
        padding: 10px;
    }
    td {
        text-align: left;
        padding: 8px;
    }
    .following:nth-child(even) {
        background-color: #123658;
    }
    a {
        color: #1da1f2;
    }
    .uButton {
        color: #ffffff;
        background-color: #1da1f2;
        font-size: 13px;
        border: 1px solid #1da1f2;
        border-radius: 15px;
        padding: 5px 15px;
        cursor: pointer;
    }
    .uButton:hover {
        color: #1da1f2;
        background-color: #ffffff;
    }
    .uftext {
        align-items: center;
        padding: 8px;
    }
    #progress-bar {
    width: 100%;
    height: 8px;
    background: #cccccc;
    position: relative;
    overflow: hidden;
}

#progress-bar-percentage.Frequently {
    background: #ff0000;
    padding: 5px 0px;
    color: #FFF;
    text-align: center;
    height: 20px;
}
#progress-bar-percentage.Sometimes {
    background: #ff8000;
    padding: 5px 0px;
    color: #FFF;
    text-align: center;
    height: 20px;
}
#progress-bar-percentage.Occasionally {
    background: #ffff00;
    padding: 5px 0px;
    color: #FFF;
    text-align: center;
    height: 20px;
}
#progress-bar-percentage.Rarely {
    background: #00ff00;
    padding: 5px 0px;
    color: #FFF;
    text-align: center;
    height: 20px;
}

#progress-bar-percentage span {
    display: inline-block;
    position: absolute;
    width: 100%;
    left: 0;
}
</style>
