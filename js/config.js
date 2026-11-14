/* =====================================================================
   EVERYTHING PERSONAL LIVES HERE. Edit only this file (plus the short
   chapter-1 intro text in index.html).
   SECURITY NOTE: the PIN and password are sentimental gates only. On a
   static site anyone can read them with "View Source". Not encryption.
   ===================================================================== */

function placeholderArt(label) {
  const t = String(label || 'Your photo here').replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8BBD0"/><stop offset="1" stop-color="#E9D5FF"/></linearGradient></defs><rect width="600" height="750" fill="url(#g)"/><text x="300" y="360" font-size="120" text-anchor="middle" fill="#fff" opacity=".9">♡</text><text x="300" y="450" font-size="26" text-anchor="middle" fill="#8B4967" font-family="sans-serif">${t}</text><text x="300" y="490" font-size="20" text-anchor="middle" fill="#8B4967" font-family="sans-serif" opacity=".7">placeholder</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* Placeholder generator. Replace with your real list (see README). */
function demo(prefix, n, videoAt = -1) {
  return Array.from({ length: n }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    type: i === videoAt ? 'video' : 'image',
    src: '',            // e.g. 'assets/images/beach.jpg' or 'assets/videos/trip.MP4'
    thumb: '',          // optional poster for videos
    title: i === videoAt ? 'Video memory title' : `Memory title ${i + 1}`,
    caption: 'Your caption goes here.',
    date: 'Date (optional)'
  }));
}

const CONFIG = {
  /* Dev mode accepts 000000 / "demo" ONLY while the placeholders below are
     unchanged. Set to false before deploying. */
  devMode: true,

  pin: '010701',            // exactly six digits, e.g. '120425'
  password: 'svenn',
  caseInsensitive: true,                // password matching
  clue: 'you used to use this as password',

  audioFile: 'assets/audio/Justin Vasquez - Yours.mp3',   // put your file in assets/audio/ and match the name; takes priority over YouTube. Use '' to use YouTube instead
  youtube: 'https://www.youtube.com/watch?v=c-NNMb1DhUE',                          // full YouTube URL or 11-character video ID
  song: { title: 'Yours', artist: 'Justine Vasquez' },

  music: { volume: 70 },                // preferred volume 0-100
  ducking: { enabled: true, level: 30, fadeDown: 800, fadeUp: 1000 },

  memories: {
    
  adventures: [
    {
      id: 'adv-1',
      type: 'image',
      src: 'assets/images/3.JPEG',
      title: 'TCH Balamban',
      caption: 'One of our first rides together. Little did we know, this was just the beginning of so many adventures. ❤️'
    },
    {
      id: 'adv-2',
      type: 'image',
      src: 'assets/images/4.JPEG',
      title: 'Toledo Beach',
      caption: 'A little beach outing with your family. Simple days like this are always worth remembering.'
    },
    {
      id: 'adv-3',
      type: 'video',
      src: 'assets/videos/5.MP4',
      title: 'Negros Trip',
      caption: 'Our longest drive together! HAHAHA. Long roads feel a lot shorter when I have you with me.'
    },
    {
      id: 'adv-4',
      type: 'image',
      src: 'assets/images/7.JPEG',
      title: 'Random Moments',
      caption: 'Nothing beats fresh coconut after a long, exhausting walk. HAHAHA. We really needed that one!'
    },
    {
      id: 'adv-5',
      type: 'video',
      src: 'assets/videos/6.MP4',
      title: 'Negros Lake',
      caption: 'One of the most exciting places we visited together. Definitely a memory I would love to experience again!'
    },
    {
      id: 'adv-6',
      type: 'image',
      src: 'assets/images/8.JPEG',
      title: 'Our First Bohol Trip',
      caption: 'Our first time in Bohol together, and also one of the most special days of my life. This trip will always have a special place in my heart. ❤️'
    },
    {
      id: 'adv-7',
      type: 'video',
      src: 'assets/videos/9.MP4',
      title: 'Purisima Mountain View',
      caption: 'Our first mountain-view adventure together! Beautiful views, good food, and of course, my favorite person.'
    },
    {
      id: 'adv-8',
      type: 'video',
      src: 'assets/videos/10.MP4',
      title: 'Beach Day',
      caption: 'A family outing at a place we never expected to visit. HAHAHA. Sometimes the unplanned trips turn into the best memories.'
    },
    {
      id: 'adv-9',
      type: 'image',
      src: 'assets/images/11.JPEG',
      title: 'Man-Made Forest',
      caption: 'Our second time in Bohol, but our first time visiting the Man-Made Forest together. Another place checked off our list! ❤️'
    },
    {
      id: 'adv-10',
      type: 'image',
      src: 'assets/images/12.JPEG',
      title: 'Chocolate Hills',
      caption: '214 steps with you! HAHAHA. All that climbing was worth it, especially because I got to experience it with you.'
    },
    {
      id: 'adv-11',
      type: 'image',
      src: 'assets/images/13.JPEG',
      title: 'Our Third Bohol Trip',
      caption: 'HAHAHA, trying to act normal, but we were actually so excited! Third time in Bohol, and still making new memories.'
    },
    {
      id: 'adv-12',
      type: 'video',
      src: 'assets/videos/14.MP4',
      title: 'ATV Ride at Chocolate Hills',
      caption: 'Your first time driving an ATV! I was so proud of you, baby. HAHAHA. Btw, this video is 2 minutes long, so feel free to skip ahead!'
    },
    {
      id: 'adv-13',
      type: 'image',
      src: 'assets/images/15.JPEG',
      title: 'Panglao Kartways',
      caption: 'You were so nervous at first, HAHAHA! But seeing you enjoy it afterward made me so happy.'
    },
    {
      id: 'adv-14',
      type: 'image',
      src: 'assets/images/16.JPEG',
      title: 'Hinagdanan Cave',
      caption: 'Such a breathtaking place. Another beautiful experience I am glad we got to share together.'
    },
    {
      id: 'adv-15',
      type: 'image',
      src: 'assets/images/17.JPEG',
      title: 'Sikatuna',
      caption: 'I still remember how beautiful you looked that day. Well, you always do, but this one deserves its own appreciation. HAHAHA. ❤️'
    },
    {
      id: 'adv-16',
      type: 'image',
      src: 'assets/images/18.JPEG',
      title: 'Badian Lambug Beach',
      caption: 'Another unexpected adventure, this time with your best friend! HAHAHA. I love how our random plans turn into memories worth keeping.'
    },
  ],
    
    forever: [
      {
        id: 'forever-1',
        type: 'video',
        src: 'assets/videos/19.MP4',
        title: 'Seaside Gala',
        caption: 'You always wanted us to go here together, and we finally did. Another little memory with you. ❤️'
      },
      {
        id: 'forever-2',
        type: 'image',
        src: 'assets/images/20.JPEG',
        title: '',
        caption: 'Look at youuu, so pretty as always. 🥹'
      },
      {
        id: 'forever-3',
        type: 'image',
        src: 'assets/images/21.JPEG',
        title: '',
        caption: 'Sunkissed? HAHAHA. The sun really understood the assignment.'
      },
      {
        id: 'forever-4',
        type: 'image',
        src: 'assets/images/22.JPEG',
        title: '',
        caption: 'One of your favorite hobbies: window shopping. HAHAHA. I love walking around with you, though.'
      },
      {
        id: 'forever-5',
        type: 'image',
        src: 'assets/images/28.JPEG',
        title: '',
        caption: 'And of course, we can never go anywhere without taking pictures. HAHAHA.'
      },
      {
        id: 'forever-6',
        type: 'image',
        src: 'assets/images/23.JPEG',
        title: '',
        caption: 'You really love taking pictures of us, and I love that. Now we have all these little moments to look back on. ❤️'
      },
      {
        id: 'forever-7',
        type: 'image',
        src: 'assets/images/24.JPEG',
        title: 'Vikings Buffet',
        caption: 'Our first buffet together, on your birthday! More birthdays and food dates with you, please. 🥹'
      },
      {
        id: 'forever-8',
        type: 'image',
        src: 'assets/images/25.JPEG',
        title: '',
        caption: 'HAHAHA, it looks like we rented the whole bus! And btw, your hair looked so pretty here.'
      },
      {
        id: 'forever-9',
        type: 'image',
        src: 'assets/images/26.JPEG',
        title: 'Our All-Time Favorite Meal',
        caption: 'Jollibee with your pamangkin! Simple moments like this are always special to me.'
      },
      {
        id: 'forever-10',
        type: 'image',
        src: 'assets/images/27.JPEG',
        title: '',
        caption: 'You still look the same, though. Still the same beautiful girl I fell in love with. ❤️'
      },
      {
        id: 'forever-11',
        type: 'image',
        src: 'assets/images/29.JPEG',
        title: 'Photobooth at IT Park',
        caption: 'My first photobooth experience, and of course, it had to be with you. HAHAHA. ❤️'
      },
      {
        id: 'forever-12',
        type: 'image',
        src: 'assets/images/30.JPEG',
        title: '',
        caption: 'HAHAHA, I honestly didn\'t expect us to take this picture, but I\'m glad we did.'
      },
      {
        id: 'forever-13',
        type: 'image',
        src: 'assets/images/31.JPEG',
        title: '',
        caption: 'And here we are, another memory added to our little collection. I hope we never stop making more. ❤️'
      },
    ],

  },

  letter: [
    'To my favorite person, my baby. ❤️',

    'Advance Happy monthsary, my love! ❤️',

    'First of all, HAHAHA, surprise! I know you\'ve always wanted us to have our own photo album, something we could look through together and remember all the little moments we\'ve shared. We haven\'t had the chance to print our pictures yet, so I thought, why not make something a little different and special for you?',

    'That\'s why I made this little website. It\'s our own digital photo album, but with our videos, our memories, and even music to listen to while looking back at everything we\'ve experienced together. I wanted to make something that you could always come back to whenever you miss me or whenever you just want to remember how far we\'ve come.',

    'I know you\'ve always wanted us to travel together, just the two of us, exploring new places, taking pictures, and making memories. And baby, I want that too. I want to take you to so many beautiful places, watch you get excited over the smallest things, take hundreds of pictures of you even when you tell me to stop, HAHAHA, and experience all the things we\'ve always talked about.',

    'But there\'s something else I really want to tell you.',

    'I\'m so proud of you, baby.',

    'I know how much you\'ve been trying with your studies, and I know there are times when you worry about your grades and whether you\'re doing enough. But please, don\'t be too hard on yourself, okay?',

    'Of course, getting high grades is something to be happy about, and I\'ll always celebrate your achievements with you. But I want you to know that you don\'t have to get perfect grades just to make me proud.',

    'Because I\'m already proud of you.',

    'I know you had to put your studies aside before and start working early to help provide for your family\'s needs. I know life hasn\'t always been easy for you, and I admire how much you\'ve sacrificed and how hard you\'ve worked to get to where you are today.',

    'And now that you\'re continuing your studies, I hope you give yourself the same kindness and patience that you always give to other people. You don\'t have to figure everything out all at once. You don\'t have to be the best at everything. Just keep doing your best, at your own pace.',

    'And whenever things get overwhelming, remember that you have me. I\'m always here to listen to your worries, cheer you on, help you when I can, and remind you how amazing you are, especially on the days when you forget it yourself.',

    'I love you so much, love. More than I probably say, and sometimes more than I know how to explain. I want to keep choosing you, supporting you, taking care of you, and doing everything I can to make you happy.',

    'I hope that in the coming months and years, we\'ll get to travel to so many more places together. I hope we\'ll have more random dates, more long rides, more silly pictures, more unexpected adventures, and more moments that we\'ll wish could last forever.',

    'And someday, I hope we\'ll finally sit down together, print all our favorite pictures, and make that physical photo album you\'ve always wanted. We\'ll choose the pictures together, laugh at the funny ones, and remember the stories behind each one.',

    'For now, I hope this little website reminds you of how much you mean to me.',

    'Because every picture, every video, and every memory here has one thing in common.',

    'You.',

    'And no matter how many places we visit or how many years pass, you\'ll always be my favorite part of every adventure.',

    'Happy monthsary again, love. Thank you for being part of my life, for all the memories we\'ve made, and for all the beautiful moments we haven\'t experienced yet.',

    'I love you, always. ❤️',

    'Your forever travel buddy, photographer, and biggest supporter.'
  ],

  finalMessage: `SURPRISE, LOVE! ❤️

    Our next adventure is waiting!

    WE'RE GOING TO CEBU SAFARI! 🦒🦁

    And of course, a little swimming date too! 🌊

    Just you and me, making another
    beautiful memory together.

    Advance Happy monthsary, my love!
    I LOVE YOU SO MUCH! ❤️`
};
