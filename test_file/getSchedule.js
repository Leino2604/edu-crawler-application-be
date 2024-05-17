const pool = require("../app/utils/db_connect");

const getScheduleList = async () => {
    try {
        const query = `SELECT u."FullName", u."Mail", s."Url", s."ScheduledTime" 
        FROM public."User" AS u 
        INNER JOIN public."Spider" AS s ON u."ID" = s."CreatedByID" 
        WHERE s."IsScheduled" = True
        `;
        // const query = `SELECT * FROM public."Spider"`;

        await pool.connect();

        const result = await pool.query(query);

        console.log(result.rowCount);
    } catch (e) {
        console.error('Error on get Schedule:', e);
    }
}

getScheduleList()