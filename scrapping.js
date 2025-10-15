const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeCourses(cookies) {
  try {
    const response = await axios.get('https://kuliah.uajy.ac.id/', {
      headers: {
        'Cookie': cookies
      }
    });
    const $ = cheerio.load(response.data);
    
    const data = $('#frontpage-course-list > div').children().toArray()
      .filter(v => v)
      .map(v => ({
        course: $(v).find('.coursename').text(),
        link: $(v).find('.coursename a').attr('href')
      }));
    
    // For each course, fetch its page and parse sections and activities
    const results = [];

    for (const item of data) {
      if (!item.link) continue;
      try {
        const courseResp = await axios.get(item.link, {
          headers: { Cookie: cookies }
        });
        const $$ = cheerio.load(courseResp.data);

        // Map sections as the user-specified DOM traversal
        const rawSections = Object.values($$('.course-content ul').children().toArray() || [])
          .map((v, i) => {
            const section = $$(v);
            const activities = Object.values(section.find('.activity-item').toArray() || [])
              .map(a => {
                const activity = $$(a);
                const linkEl = activity.find('a').first();
                const formEl = activity.find('form').first();
                return {
                  activity: linkEl.text() || null,
                  link: formEl.attr('action') || linkEl.attr('href') || null,
                  done: !!activity.find('.btn-success').length,
                  desc: activity.find('.description').html() ? activity.find('.description').html().trim() : ''
                };
              });

            return {
              title: (section.find('.sectionname').text() || '').trim(),
              activities
            };
          });

        // Remove completely empty sections (no title and no activities)
        // Also avoid adding duplicate empty-title sections: merge activities of consecutive empty-title sections
        const sections = [];
        for (const sec of rawSections) {
          const isEmptyTitle = sec.title === '';
          const hasActivities = Array.isArray(sec.activities) && sec.activities.length > 0;

          if (!isEmptyTitle || hasActivities) {
            if (isEmptyTitle && sections.length > 0 && sections[sections.length - 1].title === '') {
              // merge activities into previous empty-title section to avoid duplicates
              sections[sections.length - 1].activities.push(...sec.activities);
            } else {
              // push a copy to avoid accidental mutation
              sections.push({ title: sec.title, activities: sec.activities.slice() });
            }
          }
        }

        results.push({ course: item.course, link: item.link, sections });
      } catch (err) {
        console.error(`Failed to fetch course page ${item.link}:`, err.message || err);
      }
    }

    return results;
  } catch (error) {
    console.error('Error scraping:', error);
  }
}

// Caller: provide cookies string; save the returned result to a JSON file.
scrapeCourses("MoodleSession=t2l5iodfeteadinj23jr7ljdgt; MOODLEID1_=%25D6F6%25B6%25FD%25DDM%25C9%250E").then(result => {
  if (!result) return;
  const fs = require('fs');
  try {
    fs.writeFileSync('courses.json', JSON.stringify(result, null, 2), 'utf8');
    console.log('Saved courses.json with', result.length, 'courses');
  } catch (err) {
    console.error('Failed to write courses.json:', err);
  }
}).catch(err => console.error('Scrape failed:', err));
