/* ============ QUESTION BANK ============ */
/* Three tiers. Large enough that "no repeats across sessions" lasts many sessions. */
const BANK = {
  warm: [
    "What's a small, ordinary thing that reliably makes your whole day better?",
    "If a stranger shadowed you for a day, what would they get completely wrong about you?",
    "What did you want to be when you were eight, and what did eight-year-old you understand that you've forgotten?",
    "What's something you were sure you'd grow out of and never did?",
    "If your life had a song playing under it right now, what would be on?",
    "What's the best compliment you've ever gotten that the person has surely forgotten giving?",
    "What's a slightly weird comfort or ritual you'd never give up?",
    "If you could be effortlessly great at one skill overnight, which — and would you actually want the 'effortless' part?",
    "What do you find beautiful that most people walk right past?",
    "Invite any three people, living or dead, to dinner — who's at the table?",
    "When did you last laugh so hard it hurt, and what set it off?",
    "What's a hill you'll happily die on that absolutely does not matter?",
    "What's the most overrated and the most underrated of the five senses, in your view?",
    "What fictional world would you actually want to live in, knowing the downsides?",
    "What's a tiny skill or party trick of yours nobody here knows about?",
    "What's something you've changed your mind about in the last year?",
    "What's your most-used app or object, and what does it say about you?",
    "If you had a totally free day with zero obligations, walk us through it.",
    "What smell instantly transports you somewhere, and where?",
    "What's a piece of advice you ignored and were right to ignore?",
    "What's the last thing that genuinely delighted you?",
    "What did you collect, build, or obsess over as a kid?",
    "What's a rule you happily break?",
    "If you could keep one ordinary morning from your life on a loop, which one — and what made it ordinary?",
    "What's something you find easy that a lot of people seem to find hard?",
    "What's a place — real or imagined — you go to in your head to feel calm?",
    "What's the pettiest thing that can ruin your mood?",
    "What's a compliment you've wanted to give someone here but haven't?",
    "What's a food that tastes like your childhood?",
    "What's a small win from this past week you didn't tell anyone about?",
    "Who's someone we'd be surprised to learn how much they mean to you?",
    "What's the strangest job you'd genuinely be good at?",
  ],
  deep: [
    "Who taught you the most without ever trying to teach you anything?",
    "Is there a past version of yourself you feel tenderness toward now, even if you didn't then?",
    "What did you believe deeply at twenty that you've since let go of — and what changed your mind?",
    "What's a moment you're proud of that you've never really told anyone?",
    "What does your family teach you about how you love people now?",
    "If you could relive one conversation and say the thing you didn't say, which?",
    "What's a fear you carry that you suspect isn't really about the thing you say it's about?",
    "When have you felt most like yourself — and who, if anyone, was there?",
    "What kindness has someone shown you that you've never been able to repay?",
    "What do you hope is true about you that you're not yet sure of?",
    "What's a dream you've quietly downsized — and do you want to un-downsize it?",
    "When did you last feel genuinely understood, and by whom?",
    "What's a hard thing you're going through right now that you've been minimizing?",
    "What's something you're still grieving, even if it doesn't look like grief from outside?",
    "What did a failure teach you that success never would have?",
    "What part of getting older are you most afraid of?",
    "When did you realize your parents (or who raised you) were just people?",
    "What do you wish the people who love you understood without you having to explain?",
    "What's a door you chose not to walk through that you still wonder about?",
    "What do you do with your anger, and where did you learn that?",
    "What's a kind of love you find hardest to accept when it's offered to you?",
    "What's something you've been quietly proud of and haven't told anyone?",
    "When have you felt the most alone this past year?",
    "What's a regret that still visits you sometimes?",
    "What's the bravest thing you've done that no one would call brave?",
    "Whose approval are you still chasing, even if you'd never admit it?",
    "What's a belief you hold that you suspect you'd struggle to defend?",
    "What did you need as a kid that you didn't get, and how do you give it to yourself now?",
    "What's something you're working hard to become, that isn't visible yet?",
    "When did you last surprise yourself?",
    "What do you need more of from the people closest to you?",
    "What's a story your family tells about you that you've never corrected?",
  ],
  deepest: [
    "What do you rarely say out loud because saying it makes it real?",
    "When did you last cry, and what was it about?",
    "What's a regret you've made peace with — and one you haven't?",
    "What's true about you that you're a little afraid the people here would think differently of you for knowing?",
    "When have you felt most lonely, even surrounded by people?",
    "What part of yourself are you hoping the people who love you will be patient with?",
    "If tonight were the last time you saw everyone here, what would you want each of them to know?",
    "What's a wound from your past that still shapes how you need to be loved?",
    "Go around: tell the person on your left one true thing you admire in them.",
    "What's something you've never told this group that you trust them enough to say now?",
    "What do you most want to be forgiven for?",
    "Go around: name a strength you see in the person to your right that you suspect they undervalue.",
    "What's a fear about your future you've never said out loud?",
    "When did someone see you clearly at a moment you felt invisible?",
    "What would you want said about you, by someone who really knew you, when you're gone?",
    "What's the hardest thing you're carrying right now that you came here not planning to mention?",
    "Go around: tell someone here about a moment they were there for you that they may not even remember.",
    "What's a way you've changed that you're not sure the people who knew the old you have noticed?",
    "What do you most need to hear right now, even if no one can promise it?",
    "What's something tender you think about the people in this circle but rarely say?",
    "When were you most afraid of losing someone in this room?",
    "What's a part of your inner life that surprises even you?",
    "Go around: finish the sentence to the group — 'something I've never thanked you for is…'",
    "What's the truest thing you could say about who you are right now, tonight?",
    "What are you hoping will be different about your life a year from now, and are you afraid to say it?",
    "What's a question you wish someone would ask you?",
    "Look around the circle: what do you want to remember about this exact group of people, years from now?",
  ],
};

/* ============ Traditional Chinese (Taiwan) translations, keyed by English ============ */
const ZH = {
  "What's a small, ordinary thing that reliably makes your whole day better?":
    "有什麼微不足道的小事，總能讓你一整天都變好？",
  "If a stranger shadowed you for a day, what would they get completely wrong about you?":
    "如果有個陌生人跟著你一整天，他們會對你產生什麼完全錯誤的印象？",
  "What did you want to be when you were eight, and what did eight-year-old you understand that you've forgotten?":
    "八歲時你想成為什麼？那時的你懂得哪些你現在已經忘記的事？",
  "What's something you were sure you'd grow out of and never did?":
    "有什麼是你曾確信長大後會擺脫、卻始終沒擺脫的？",
  "If your life had a song playing under it right now, what would be on?":
    "如果此刻你的人生有一首背景音樂，會是哪一首？",
  "What's the best compliment you've ever gotten that the person has surely forgotten giving?":
    "你收過最棒、而對方肯定早就忘了曾說過的讚美是什麼？",
  "What's a slightly weird comfort or ritual you'd never give up?":
    "有什麼有點古怪、卻讓你安心、絕不願放棄的習慣或儀式？",
  "If you could be effortlessly great at one skill overnight, which — and would you actually want the 'effortless' part?":
    "如果你能一夜之間毫不費力地精通一項技能，會是哪一項？而你真的想要「毫不費力」這部分嗎？",
  "What do you find beautiful that most people walk right past?":
    "有什麼你覺得很美、大多數人卻視而不見的事物？",
  "Invite any three people, living or dead, to dinner — who's at the table?":
    "邀請任何三個人共進晚餐，無論在世與否——餐桌上會有誰？",
  "When did you last laugh so hard it hurt, and what set it off?":
    "你上次笑到肚子痛是什麼時候？是什麼引起的？",
  "What's a hill you'll happily die on that absolutely does not matter?":
    "有什麼其實一點都不重要、你卻願意死守到底的堅持？",
  "What's the most overrated and the most underrated of the five senses, in your view?":
    "在你看來，五感當中哪一個被高估、哪一個被低估？",
  "What fictional world would you actually want to live in, knowing the downsides?":
    "明知有缺點，你還是真的想住進哪個虛構世界？",
  "What's a tiny skill or party trick of yours nobody here knows about?":
    "有什麼在場沒人知道的小本領或派對才藝？",
  "What's something you've changed your mind about in the last year?":
    "過去一年裡，有什麼事你改變了看法？",
  "What's your most-used app or object, and what does it say about you?":
    "你最常用的 app 或物品是什麼？它透露了你的什麼？",
  "If you had a totally free day with zero obligations, walk us through it.":
    "如果你有完全自由、毫無義務的一天，帶我們走過你會怎麼過。",
  "What smell instantly transports you somewhere, and where?":
    "有什麼氣味會瞬間把你帶到某個地方？是哪裡？",
  "What's a piece of advice you ignored and were right to ignore?":
    "有什麼建議你當初沒理會，事後證明不理會是對的？",
  "What's the last thing that genuinely delighted you?":
    "最近一件真正讓你感到欣喜的事是什麼？",
  "What did you collect, build, or obsess over as a kid?":
    "小時候你收集、製作或著迷於什麼？",
  "What's a rule you happily break?": "有什麼規則是你樂於打破的？",
  "If you could keep one ordinary morning from your life on a loop, which one — and what made it ordinary?":
    "如果你能讓人生中某個平凡的早晨不斷重播，會是哪一個？是什麼讓它如此平凡？",
  "What's something you find easy that a lot of people seem to find hard?":
    "有什麼事你覺得很容易、許多人卻覺得很難？",
  "What's a place — real or imagined — you go to in your head to feel calm?":
    "有什麼地方——真實或想像——是你會在腦海中前往、藉以平靜下來的？",
  "What's the pettiest thing that can ruin your mood?":
    "什麼樣最微不足道的小事就能毀掉你的心情？",
  "What's a compliment you've wanted to give someone here but haven't?":
    "有什麼讚美你一直想對在場某人說、卻還沒說出口？",
  "What's a food that tastes like your childhood?":
    "有什麼食物吃起來就像你的童年？",
  "What's a small win from this past week you didn't tell anyone about?":
    "過去這一週有什麼你沒跟任何人提起的小小勝利？",
  "Who's someone we'd be surprised to learn how much they mean to you?":
    "有誰對你的意義之深，會讓我們感到意外？",
  "What's the strangest job you'd genuinely be good at?":
    "有什麼最奇怪的工作是你其實會做得很好的？",

  "Who taught you the most without ever trying to teach you anything?":
    "誰從沒打算教你什麼，卻教會了你最多？",
  "Is there a past version of yourself you feel tenderness toward now, even if you didn't then?":
    "有沒有某個過去的自己，是你如今心生憐惜、儘管當時並非如此？",
  "What did you believe deeply at twenty that you've since let go of — and what changed your mind?":
    "二十歲時你深信不疑、後來卻放下的是什麼？是什麼改變了你的想法？",
  "What's a moment you're proud of that you've never really told anyone?":
    "有什麼讓你自豪、卻從未真正告訴過任何人的時刻？",
  "What does your family teach you about how you love people now?":
    "你的家庭，教會了你如今如何去愛人？",
  "If you could relive one conversation and say the thing you didn't say, which?":
    "如果你能重來一次某場對話、說出當時沒說的話，會是哪一場？",
  "What's a fear you carry that you suspect isn't really about the thing you say it's about?":
    "你心裡有什麼恐懼，你懷疑它其實並不是你口中所說的那回事？",
  "When have you felt most like yourself — and who, if anyone, was there?":
    "你什麼時候最覺得自己就是自己？當時有誰在場（如果有的話）？",
  "What kindness has someone shown you that you've never been able to repay?":
    "有誰對你的善意，是你一直無以回報的？",
  "What do you hope is true about you that you're not yet sure of?":
    "有什麼關於你的事，你希望是真的、卻還不確定？",
  "What's a dream you've quietly downsized — and do you want to un-downsize it?":
    "有什麼夢想你悄悄縮小了？你想把它放大回去嗎？",
  "When did you last feel genuinely understood, and by whom?":
    "你上次真正感到被理解是什麼時候？被誰？",
  "What's a hard thing you're going through right now that you've been minimizing?":
    "你現在正經歷什麼難關，卻一直把它輕描淡寫？",
  "What's something you're still grieving, even if it doesn't look like grief from outside?":
    "有什麼你仍在哀悼的事，即使從外表看起來不像哀傷？",
  "What did a failure teach you that success never would have?":
    "有什麼是失敗教會你、而成功永遠教不會的？",
  "What part of getting older are you most afraid of?":
    "對於變老，你最害怕的是哪一部分？",
  "When did you realize your parents (or who raised you) were just people?":
    "你什麼時候意識到，你的父母（或撫養你的人）也不過是凡人？",
  "What do you wish the people who love you understood without you having to explain?":
    "你多希望愛你的人不必你解釋就能明白什麼？",
  "What's a door you chose not to walk through that you still wonder about?":
    "有哪扇門是你當初選擇不走進去、至今仍念念不忘的？",
  "What do you do with your anger, and where did you learn that?":
    "你都如何處理你的憤怒？這是從哪裡學來的？",
  "What's a kind of love you find hardest to accept when it's offered to you?":
    "當別人對你付出時，哪一種愛是你最難以接受的？",
  "What's something you've been quietly proud of and haven't told anyone?":
    "有什麼是你默默自豪、卻沒告訴過任何人的？",
  "When have you felt the most alone this past year?":
    "過去這一年，你什麼時候感到最孤獨？",
  "What's a regret that still visits you sometimes?":
    "有什麼遺憾至今偶爾仍會找上你？",
  "What's the bravest thing you've done that no one would call brave?":
    "你做過最勇敢、卻沒人會稱之為勇敢的事是什麼？",
  "Whose approval are you still chasing, even if you'd never admit it?":
    "你至今仍在追求誰的認可，即使你絕不會承認？",
  "What's a belief you hold that you suspect you'd struggle to defend?":
    "你抱持什麼信念，卻懷疑自己其實難以為它辯護？",
  "What did you need as a kid that you didn't get, and how do you give it to yourself now?":
    "小時候你需要、卻沒得到的是什麼？如今你又如何給予自己？",
  "What's something you're working hard to become, that isn't visible yet?":
    "你正努力成為什麼樣的人，而這還看不出來？",
  "When did you last surprise yourself?": "你上次讓自己感到意外是什麼時候？",
  "What do you need more of from the people closest to you?":
    "你需要最親近的人多給你一些什麼？",
  "What's a story your family tells about you that you've never corrected?":
    "你的家人講過什麼關於你的故事，是你從未糾正過的？",

  "What do you rarely say out loud because saying it makes it real?":
    "有什麼話你很少說出口，因為一說出來它就成真了？",
  "When did you last cry, and what was it about?":
    "你上次哭是什麼時候？為了什麼？",
  "What's a regret you've made peace with — and one you haven't?":
    "有什麼遺憾你已經釋懷了？又有哪一個還沒有？",
  "What's true about you that you're a little afraid the people here would think differently of you for knowing?":
    "有什麼關於你的真相，你有點害怕在場的人知道後會對你改觀？",
  "When have you felt most lonely, even surrounded by people?":
    "你什麼時候即使身邊圍滿了人、卻感到最孤獨？",
  "What part of yourself are you hoping the people who love you will be patient with?":
    "你希望愛你的人能對你的哪一部分多點耐心？",
  "If tonight were the last time you saw everyone here, what would you want each of them to know?":
    "如果今晚是你最後一次見到在場的每個人，你會想讓他們各自知道什麼？",
  "What's a wound from your past that still shapes how you need to be loved?":
    "有什麼過去的傷，至今仍形塑著你需要被愛的方式？",
  "Go around: tell the person on your left one true thing you admire in them.":
    "依序進行：告訴你左邊的人一件你真心欣賞他的事。",
  "What's something you've never told this group that you trust them enough to say now?":
    "有什麼你從未告訴過這群人的事，而你現在夠信任他們、願意說出來？",
  "What do you most want to be forgiven for?": "你最想為什麼事被原諒？",
  "Go around: name a strength you see in the person to your right that you suspect they undervalue.":
    "依序進行：說出你在右邊的人身上看到、而你懷疑他自己低估了的一項長處。",
  "What's a fear about your future you've never said out loud?":
    "有什麼對未來的恐懼是你從未說出口的？",
  "When did someone see you clearly at a moment you felt invisible?":
    "在你覺得自己彷彿隱形的時刻，有誰曾真正看見了你？",
  "What would you want said about you, by someone who really knew you, when you're gone?":
    "當你離開人世時，你會希望一個真正了解你的人怎麼形容你？",
  "What's the hardest thing you're carrying right now that you came here not planning to mention?":
    "你此刻肩上扛著最沉重、卻原本不打算在這裡提起的事是什麼？",
  "Go around: tell someone here about a moment they were there for you that they may not even remember.":
    "依序進行：告訴在場某人，一個他曾陪伴你、而他自己可能根本不記得的時刻。",
  "What's a way you've changed that you're not sure the people who knew the old you have noticed?":
    "你有什麼樣的轉變，是認識舊日的你的人未必察覺到的？",
  "What do you most need to hear right now, even if no one can promise it?":
    "此刻你最需要聽到什麼，即使沒有人能夠保證？",
  "What's something tender you think about the people in this circle but rarely say?":
    "對於這個圈子裡的人，你心中有什麼溫柔的想法、卻很少說出口？",
  "When were you most afraid of losing someone in this room?":
    "你什麼時候最害怕失去這房間裡的某個人？",
  "What's a part of your inner life that surprises even you?":
    "你的內心世界有哪一部分，連你自己都感到意外？",
  "Go around: finish the sentence to the group — 'something I've never thanked you for is…'":
    "依序進行，對著大家把這句話說完——「有一件我從沒謝過你們的事是……」",
  "What's the truest thing you could say about who you are right now, tonight?":
    "關於此刻、今晚的你是誰，你能說出最真實的一句話是什麼？",
  "What are you hoping will be different about your life a year from now, and are you afraid to say it?":
    "一年後你希望自己的人生有什麼不同？你害怕說出來嗎？",
  "What's a question you wish someone would ask you?":
    "有什麼問題是你希望有人來問你的？",
  "Look around the circle: what do you want to remember about this exact group of people, years from now?":
    "環顧這個圈子：多年以後，你會想記住關於此刻這群人的什麼？",
};

/* ============ Dare deck — escalates with the tier. Pass a question → draw one of these. ============ */
const DARES = {
  warm: [
    "Do your best impression of someone else in the circle until they guess who it is.",
    "Speak only in questions until it's your turn again.",
    "Let the person on your left pick any one of the warm-up questions for you to answer right now.",
    "Show the group the last photo in your camera roll and explain it.",
    "Talk in an accent that isn't yours until the next card.",
    "Do 10 seconds of your signature dance, no music.",
    "Read the next question aloud in the most dramatic voice you can manage.",
    "Pay a genuine compliment to every single person in the circle before moving on.",
    "Let the group give you a new nickname for the rest of the session.",
    "Share the most-used emoji in your messages and what it really means.",
    "Swap seats with the person across from you and answer as if you were them.",
    "Do your best villain laugh, and commit to it.",
    "Narrate the next 20 seconds of the room like a nature documentary host.",
    "Sing your answer to the next question, opera-style, no matter how short.",
    "Do your best impression of a celebrity reading the back of a cereal box.",
    "Strike a dramatic superhero pose and hold it until your next turn.",
    "Talk like a 1950s radio announcer until the next card is drawn.",
  ],
  deep: [
    "Answer the question you just passed — but the person on your right asks it again in their own words.",
    "Let the group choose a different deepening question for you, no passing this one.",
    "Show and read your last text to the person you love most.",
    "Tell the circle the most recent thing that made you cry or nearly cry.",
    "Give the person across from you one piece of advice you actually need to hear yourself.",
    "Name the thing you were tempted to lie about earlier tonight — you don't have to explain.",
    "Let the person to your left ask you ONE question of their choosing, and answer it honestly.",
    "Confess one small thing you've been pretending you're fine about.",
    "Tell the group a fear you have about someone in this room — kindly.",
    "Answer the next THREE questions first, no passing, before anyone else.",
    "Reveal the screen time number you're least proud of and what app did it.",
    "Tell everyone the compliment you most want to be true about yourself.",
    "Deliver the next answer as an over-the-top movie-trailer voiceover.",
    "Accept an Oscar for 'Best Performance at This Gathering' with a tearful speech.",
    "Read the next question as if it's breaking news on live TV.",
    "Give a dramatic 30-second TED talk on the most trivial opinion you hold.",
  ],
  deepest: [
    "You can skip the answer — but tell the circle the real reason it's hard to say out loud.",
    "Choose one person and tell them the thing you've never said but should.",
    "Let the group ask you anything, once, and answer it with full honesty.",
    "Answer the question — but to one specific person, looking only at them.",
    "Tell the circle what you're most afraid they think of you, and let them respond.",
    "Share the hardest truth you're willing to share tonight, on your own terms.",
    "Name the person here you most want to be closer to, and say why.",
    "Tell everyone one way you've changed because of someone in this room.",
    "Say the sentence you've been editing in your head all night.",
    "Let the person to your right say one true thing about you — and just receive it.",
  ],
};

/* Heaviest deepest prompts — skipped when gentle prompts are on. */
const INTENSE_DEEPEST = [
  "What's true about you that you're a little afraid the people here would think differently of you for knowing?",
  "If tonight were the last time you saw everyone here, what would you want each of them to know?",
  "What's a wound from your past that still shapes how you need to be loved?",
  "Go around: tell the person on your left one true thing you admire in them.",
  "What do you most want to be forgiven for?",
  "Go around: name a strength you see in the person to your right that you suspect they undervalue.",
  "What would you want said about you, by someone who really knew you, when you're gone?",
  "What's the hardest thing you're carrying right now that you came here not planning to mention?",
  "Go around: tell someone here about a moment they were there for you that they may not even remember.",
  "When were you most afraid of losing someone in this room?",
  "Go around: finish the sentence to the group — 'something I've never thanked you for is…'",
];
