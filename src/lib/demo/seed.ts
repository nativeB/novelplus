import type { Novel, Chapter, BibleEntry } from '@/types'
import { putNovel } from '@/lib/db/novels'
import { putChapters } from '@/lib/db/chapters'
import { putBibleEntries } from '@/lib/db/bible'

const NOVEL_ID = 'demo-novel-1'
const CH1 = 'demo-chapter-1'
const CH2 = 'demo-chapter-2'
const CH3 = 'demo-chapter-3'
const CH4 = 'demo-chapter-4'

const demoNovel: Novel = {
  id: NOVEL_ID,
  title: 'The Hollow King',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const demoChapters: Chapter[] = [
  {
    id: CH1,
    novelId: NOVEL_ID,
    order: 0,
    title: 'The Village at the Edge',
    wordCount: 0,
    updatedAt: Date.now(),
    content: `The Ashen Road stretched behind Maren like a grey wound across the land, pale dust still settling on her boots from the long walk west. She had followed it for three days, sleeping in ditches when the cold came down hard, eating what she could scavenge from the scrub.

The village appeared at dusk — a cluster of low stone buildings hunched against a hillside as though bracing for something. No sign above the inn. No torches lit in the windows. The kind of place that had learned not to advertise itself.

Maren pressed her left palm flat against the gate post as she entered, an old habit. The scar there — a clean line from wrist to middle finger — had come from a cartographer's compass when she was an apprentice, fifteen and careless. She'd kept the habit of touching things as she passed them ever since. Her old master called it a surveyor's instinct. She called it a nervous tic.

The innkeeper was a broad woman who looked at Maren's pack before she looked at her face.

"Just the one night," Maren said.

"Coin first."

She paid. The room was small and smelled of old smoke, but the door latched and that was enough. She spread her maps on the floor and traced the route ahead with one finger. Two more days to the archive, if the pass was clear.

She did not think about what waited at the archive. Not yet.

Outside, the Ashen Road glimmered faintly in the moonlight, pale as old bone.`,
  },
  {
    id: CH2,
    novelId: NOVEL_ID,
    order: 1,
    title: 'Embers and Ash',
    wordCount: 0,
    updatedAt: Date.now(),
    content: `The old woman was sitting outside Maren's room when she woke at dawn — cross-legged in the corridor, hands folded in her lap, patient as stone.

"You came along the Ashen Road," the old woman said. It wasn't a question.

"I did." Maren kept one hand on the door frame. "What of it?"

"Only fools or scholars travel it anymore." The old woman tilted her head. "You don't look like a scholar."

"I used to be." Maren stepped into the corridor and pulled the door shut behind her. "Who are you?"

"Someone who's been watching the road for a long time." The old woman rose smoothly, despite her age. "The Conclave sent watchers to every village along it, after the old war. I'm the last of mine." She said it without pride or grief — just a fact, like weather. "We were told to watch for anyone carrying the old maps."

Maren's jaw tightened. "I'm not carrying old maps."

"Your pack says otherwise." The woman's eyes were steady. "I won't stop you. I just want you to understand what you're walking toward." She whispered of the Conclave's reach — how their eyes were everywhere, how they had dismantled what little remained of the archive's outer defences years ago. "Whatever you're looking for up there, it's been catalogued. They know it's there. They're waiting to see who comes for it."

Maren took a long breath. "Thank you," she said, meaning it. "I'll be careful."

The old woman smiled, which was somehow worse than any warning. "No. You won't. But you'll go anyway."

She was right.`,
  },
  {
    id: CH3,
    novelId: NOVEL_ID,
    order: 2,
    title: 'The Name in the Dark',
    wordCount: 0,
    updatedAt: Date.now(),
    content: `The archive's outer door was open — not broken, not forced. Open, as though someone had simply left and not bothered to close it behind them.

Maren stood in the entrance for a long moment, listening. Wind. The creak of a beam somewhere overhead. Nothing else.

She went in.

The records room was on the ground floor, shelves running floor to ceiling and heavy with dust. She found what she was looking for in the third row: a leather journal, cracked at the spine, marked only with a symbol she recognized from the old cartographic indexes. Inside, the handwriting was cramped and urgent, the ink faded brown at the edges.

The journal entry read: *Vaelith has found the lower seal. If he breaks it, everything we buried comes back up. I have sent word to the Compact — to the Silver Compact specifically — but I do not know if they will act in time. They are cautious people. Too cautious, perhaps, for what is coming.*

Maren read the entry twice. Then she read it a third time.

Vaelith. The name sat in her chest like a stone.

She turned the page. The next entry was shorter, written in a different hand — shakier, as though the writer had been cold, or afraid:

*The Silver Compact's representative arrived this morning. Too late. The seal is already cracked. We are evacuating the lower levels. If you are reading this, we did not make it out.*

Maren closed the journal.

She put it in her pack, stood, and walked back out into the pale morning light. The Ashen Road waited below, silver-grey and silent.

She had a name now. That was something.`,
  },
  {
    id: CH4,
    novelId: NOVEL_ID,
    order: 3,
    title: 'Chapter 4 (Draft)',
    wordCount: 0,
    updatedAt: Date.now(),
    content: '',
  },
]

const demoBibleEntries: BibleEntry[] = [
  {
    id: 'be-1',
    novelId: NOVEL_ID,
    type: 'character',
    name: 'Maren',
    aliases: [],
    description: 'The protagonist. A former cartographer with a scar across her left palm from a compass accident at age fifteen.',
    firstIntroducedChapterId: CH1,
  },
  {
    id: 'be-2',
    novelId: NOVEL_ID,
    type: 'character',
    name: 'Vaelith',
    aliases: ['the Hollow King', 'the Pale Lord'],
    description: 'The primary antagonist. A necromancer who shattered the old empire and broke the lower seals.',
    firstIntroducedChapterId: CH4,
  },
  {
    id: 'be-3',
    novelId: NOVEL_ID,
    type: 'location',
    name: 'The Ashen Road',
    aliases: ['Ashen Road'],
    description: 'An ancient trade route now covered in pale volcanic dust. Runs west toward the archive.',
    firstIntroducedChapterId: CH1,
  },
  {
    id: 'be-4',
    novelId: NOVEL_ID,
    type: 'faction',
    name: 'The Conclave',
    aliases: ['Conclave'],
    description: 'A secretive order of scholars who catalogue forbidden magic and post watchers along old roads.',
    firstIntroducedChapterId: CH2,
  },
  {
    id: 'be-5',
    novelId: NOVEL_ID,
    type: 'faction',
    name: 'The Silver Compact',
    aliases: ['Silver Compact', 'the Compact'],
    description: 'A cautious merchant guild with political reach across three kingdoms.',
    firstIntroducedChapterId: CH4,
  },
]

export async function seedDemoNovel(): Promise<string> {
  const now = Date.now()
  const novel = { ...demoNovel, createdAt: now, updatedAt: now }
  const chapters = demoChapters.map((ch) => ({
    ...ch,
    updatedAt: now,
    wordCount: ch.content.trim() === '' ? 0 : ch.content.trim().split(/\s+/).length,
  }))

  await putNovel(novel)
  await putChapters(chapters)
  await putBibleEntries(demoBibleEntries)

  return novel.id
}
