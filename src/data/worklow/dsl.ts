export const longTermAbsenteeOwnerNurtureDsl = `
WORKFLOW NAME: Long-Term Absentee Owner Nurture (6 Month Cycle)

# This workflow automates the follow-up for leads that are not ready to sell immediately.
# The goal is to maintain contact and re-engage if they show interest.

GIVEN a new lead is added with tag 'Absentee Owner - Long Term'

THEN RUN SKIP TRACE to ensure data is accurate
AND START AI OUTREACH with sequence 'Long-Term Nurture - Initial Touch'

# This loop will run for a maximum of 6 months, checking in every 30 days.
WHILE contact.tag does not contain 'Closed - Won' AND loop.iteration <= 6:

    THEN WAIT for 30 days

    # Check if the lead has replied or shown any activity recently.
    IF contact.last_activity_date > 30 days ago:
        
        THEN CREATE TASK for '{{contact.assigned_user}}' with title "Review recent activity for {{contact.name}}"
        AND UPDATE CRM contact.tag by removing 'Absentee Owner - Long Term' and adding 'Needs Manual Review'
        AND STOP WORKFLOW # A human will take over, so automation ends.

    ELSE:
        
        # If there's no activity, send another AI-driven touchpoint.
        THEN START AI OUTREACH with sequence 'Monthly Re-engagement Touchpoint'
        AND ADD NOTE to contact with content "Sent monthly re-engagement touchpoint #{{loop.iteration}}."

# After the workflow or loop ends, do a final check to see why.
IF contact.tag contains 'Closed - Won':
    
    THEN SEND SMS to '{{contact.assigned_user.phone}}' with message "Congrats! The deal with {{contact.name}} has been marked as Closed."

ELSE:

    THEN CREATE TASK for '{{contact.assigned_user}}' with title "Archive lead: {{contact.name}} - Long term nurture ended with no close."
`;
