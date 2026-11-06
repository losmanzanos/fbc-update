/* Full Bloom Counseling v6 */
(function(){'use strict';

/* ── Transparent nav on scroll ── */
var hdr = document.getElementById('header');
function updateNav() {
  if (!hdr) return;
  // Lower threshold on mobile so logo goes dark immediately after hero clears
  var threshold = window.innerWidth <= 768 ? 10 : 20;
  // Pages with a light hero (body.nav-solid) keep the dark nav from the start
  if (window.scrollY > threshold || document.body.classList.contains('nav-solid')) {
    hdr.classList.add('scrolled');
    document.body.classList.add('header-scrolled');
  } else {
    hdr.classList.remove('scrolled');
    document.body.classList.remove('header-scrolled');
  }
}
if (hdr) {
  window.addEventListener('scroll', updateNav, {passive: true});
  updateNav();
}

/* ── Mobile menu ── */
var btn = document.getElementById('hamburger');
var menu = document.getElementById('mobile-menu');

function openMenu() {
  if (!menu) return;
  menu.style.cssText = 'display:flex!important;transform:translateX(100%)';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      menu.style.cssText = '';
      menu.classList.add('open');
      var spans = document.querySelectorAll('#hamburger span');
      if (spans.length === 3) {
        spans[0].style.transform = 'rotate(45deg) translate(4px,4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px,-4px)';
      }
    });
  });
  document.body.style.overflow = 'hidden';
  document.body.classList.add('menu-open');
  if (btn) { btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
  menu.setAttribute('aria-hidden','false');
}

function closeMenu() {
  if (!menu) return;
  menu.classList.remove('open');
  // Reset hamburger from X
  var spans = document.querySelectorAll('#hamburger span');
  if (spans.length === 3) {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
  if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
  menu.setAttribute('aria-hidden','true');
  // Hide after transition completes
  setTimeout(function() {
    if (!menu.classList.contains('open')) {
      menu.style.display = '';
    }
  }, 320);
  updateNav();
}

if (btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    menu && menu.classList.contains('open') ? closeMenu() : openMenu();
  });
}
var closeBtn = document.getElementById('mobile-close');
if (closeBtn) { closeBtn.addEventListener('click', closeMenu); }
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeMenu(); closeSearch(); } });
if (menu) {
  menu.querySelectorAll('a[href]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { setTimeout(closeMenu, 50); return; }
      var samePage = url.origin === location.origin && url.pathname === location.pathname;
      if (url.origin !== location.origin || samePage) { setTimeout(closeMenu, 50); return; }
      // Going to another page: leave the menu up so the old page never shows
      // through. The next page replaces it once it is ready to paint.
      leavingFromMenu = true;
      a.classList.add('is-going');
    });
  });
}

/* Coming back with the Back button restores this page from cache with the
   menu still open, so close it instantly. Only crossfade for menu exits. */
var leavingFromMenu = false;
function closeMenuNow() {
  if (!menu || !menu.classList.contains('open')) return;
  menu.style.transition = 'none';
  closeMenu();
  menu.querySelectorAll('.is-going').forEach(function(a) { a.classList.remove('is-going'); });
  requestAnimationFrame(function() { menu.style.transition = ''; });
}
window.addEventListener('pageshow', function(e) { if (e.persisted) { leavingFromMenu = false; closeMenuNow(); } });
window.addEventListener('pageswap', function(e) {
  if (e.viewTransition && !leavingFromMenu) e.viewTransition.skipTransition();
});

/* Mobile submenus */
document.querySelectorAll('.mobile-toggle-sub').forEach(function(t) {
  t.addEventListener('click', function() {
    var s = t.nextElementSibling;
    if (!s) return;
    var o = s.classList.contains('open');
    s.classList.toggle('open', !o);
    t.setAttribute('aria-expanded', o ? 'false' : 'true');
  });
});

/* ── Search overlay ── */
var searchOverlay = document.getElementById('search-overlay');
var searchInput = document.getElementById('search-input');

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('open');
  if (searchInput) setTimeout(function(){ searchInput.focus(); }, 50);
}
function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('open');
  if (searchInput) searchInput.value = '';
  var results = document.getElementById('search-results');
  if (results) results.innerHTML = '';
}

document.querySelectorAll('.nav-search, .nav-search-mobile').forEach(function(el) {
  el.addEventListener('click', function(e) { e.preventDefault(); openSearch(); });
});

var searchBtn = document.getElementById('search-submit');
if (searchBtn) searchBtn.addEventListener('click', doSearch);
if (searchInput) {
  searchInput.addEventListener('input', doSearch);
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doSearch();
    if (e.key === 'Escape') closeSearch();
  });
}

var searchCloseBtn = document.getElementById('search-close-btn');
if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
if (searchOverlay) {
  searchOverlay.addEventListener('click', function(e) {
    if (e.target === searchOverlay) closeSearch();
  });
}

/* Search index — embedded page data */
var ROOT_PATH = (function() {
  var link = document.querySelector('link[href*="style.css"]');
  if (!link) return '/';
  /* Strip any query string (e.g. the ?v=7 cache-buster) BEFORE deriving the
     path — otherwise "css/style.css?v=7" leaves a dangling "?v=7", which broke
     every search result link (e.g. /?v=7/team/...). */
  var href = link.getAttribute('href').split('?')[0];
  return href.replace('css/style.css', '') || '/';
})();

var PAGES = [
  {url:'/',title:'Therapists in Denver & Online | Full Bloom Counseling',desc:'Compassionate therapy for anxiety, trauma, relationships, disordered eating. Free consultations.',cat:'Home'},
  {url:'/therapists/',title:'Meet Our Denver Therapists',desc:'Seven licensed therapists. One practice built around depth, warmth, and evidence-based care. Find the right fit for you in Denver or online across Colorado.',cat:'About',tags:'team therapists counselors staff'},
  {url:'/about/',title:'About Our Denver Therapists',desc:'Seven licensed therapists specializing in trauma, anxiety, Enneagram, couples therapy, and more.',cat:'About'},
  {url:'/team/rebecca-moravec/',title:'Becca Moravec, LPC LMFT, Founder',desc:'Trauma-informed care, EMDR, IFS, Enneagram, couples therapy, Intuitive Eating, women\'s issues, people pleasers, millennial women.',cat:'Therapist',author:'Becca Moravec',tags:'emdr enneagram couples intuitive eating haes ifs internal family systems narrative therapy becca'},
  {url:'/team/natalie-siegel/',title:'Natalie Siegel, LPC, Therapist',desc:'Body image, disordered eating, Intuitive Eating, anxiety, self-esteem.',cat:'Therapist',author:'Natalie Siegel',tags:'haes anti-diet body image intuitive eating disordered eating binge emotional eating self-esteem postpartum'},
  {url:'/team/mark-whitney/',title:'Mark Whitney, LPC ACS, Senior Clinician',desc:'Couples therapy, anxiety, people pleasing, faith deconstruction and religious trauma, Enneagram, EMDR, SSP. Online across Colorado.',cat:'Therapist',author:'Mark Whitney',tags:'gottman couples enneagram family clinical supervision acs approved clinical supervisor emdr ssp safe sound protocol religious trauma faith deconstruction leaving religion people pleasing anxiety parts work online telehealth men'},
  {url:'/team/jillian-corpora/',title:'Jillian Corpora, LPC, Therapist',desc:'Anxiety, depression, grief, teens, young adults, ADHD, life transitions, Intuitive Eating.',cat:'Therapist',author:'Jillian Corpora',tags:'grief anxiety depression intuitive eating teen teens adolescent young adults adhd hospice life transitions'},
  {url:'/team/kirsten-adorno/',title:'Kirsten Adorno, LPC, MFTC, Therapist',desc:'Depression, trauma, grief, culturally responsive care, identity, attachment-based therapy, couples counseling.',cat:'Therapist',author:'Kirsten Adorno',tags:'cultural culturally responsive multicultural identity belonging depression trauma grief gottman couples attachment'},
  {url:'/team/kelsey-bennett/',title:'Kelsey Bennett, LPC, Therapist',desc:'Young adults, couples, emotional regulation, EMDR, SSP, Gottman. Boulder and online.',cat:'Therapist',author:'Kelsey Bennett',tags:'emdr safe sound protocol ssp gottman boulder colorado young adults couples'},
  {url:'/team/kelli-ruhl/',title:'Kelli Ruhl, LPC, Therapist',desc:'Trauma therapy, addiction recovery, somatic interventions, parts work.',cat:'Therapist',author:'Kelli Ruhl',tags:'trauma somatic addiction recovery lac complex ptsd cptsd parts work dbt act cbt postpartum'},
  {url:'/services/',title:'Therapy Services in Denver',desc:'Individual, couples, family, trauma, EMDR, Enneagram, Intuitive Eating, anxiety therapy.',cat:'Services',tags:'services all services'},
  {url:'/services/individual-therapy/',title:'Individual Therapy Denver',desc:'One-on-one therapy for anxiety, depression, trauma, relationships, life transitions. CBT, IFS, EMDR.',cat:'Service',tags:'one on one counseling talk therapy cbt'},
  {url:'/services/couples-therapy/',title:'Couples Therapy Denver',desc:'Strengthen connection, communication, and navigate conflict. Gottman Method, EFT.',cat:'Service',tags:'marriage counseling relationship gottman eft partners'},
  {url:'/services/family-therapy/',title:'Family Therapy Denver',desc:'Resolve conflict, improve communication, and build stronger family bonds.',cat:'Service',tags:'parents kids teens blended family adult children'},
  {url:'/services/enneagram-therapy/',title:'Enneagram Therapy Denver',desc:'Use the Enneagram for deep self-discovery with certified practitioners.',cat:'Service',tags:'enneagram personality type'},
  {url:'/services/health-at-every-size/',title:'Intuitive Eating & HAES Therapy Denver',desc:'Heal your relationship with food and body. Weight-neutral, affirming care.',cat:'Service',tags:'haes intuitive eating anti-diet weight neutral body image'},
  {url:'/services/trauma-therapy/',title:'Trauma Therapy Denver',desc:'EMDR, SSP, somatic therapy for PTSD, complex trauma, and attachment wounds.',cat:'Service',tags:'ptsd complex trauma cptsd emdr ifs somatic ssp'},
  {url:'/services/anxiety-therapy/',title:'Anxiety Therapy Denver',desc:'CBT, ACT, and mindfulness-based treatment for anxiety, panic, and perfectionism.',cat:'Service',tags:'panic worry perfectionism ocd stress'},
  {url:'/services/emdr/',title:'EMDR Therapy Denver',desc:'Eye Movement Desensitization and Reprocessing for trauma and PTSD.',cat:'Service',tags:'emdr trauma ptsd eye movement'},
  {url:'/services/disordered-eating/',title:'Disordered Eating & Body Image Therapy',desc:'Compassionate, weight-neutral support with Certified Intuitive Eating Counselors.',cat:'Service',tags:'eating disorder binge restriction body image haes'},
  {url:'/services/safe-and-sound/',title:'Safe and Sound Protocol (SSP) Denver',desc:'Nervous system regulation for anxiety, trauma, and sensory processing.',cat:'Service',tags:'ssp safe sound protocol nervous system polyvagal listening'},
  {url:'/services/addiction-recovery-therapy-denver/',title:'Addiction Therapy Denver',desc:'Therapy for addiction and recovery in Denver and online across Colorado with a Licensed Addiction Counselor. Trauma-informed, nonjudgmental, every stage.',cat:'Service',tags:'addiction substance use alcohol drinking sobriety sober recovery relapse lac licensed addiction counselor kelli'},
  {url:'/services/ifs-therapy-denver/',title:'IFS Therapy Denver',desc:'Internal Family Systems (IFS) therapy in Denver and online across Colorado. Parts work for anxiety, trauma, people pleasing and the inner critic.',cat:'Service',tags:'ifs internal family systems parts work inner critic protectors exiles self richard schwartz people pleasing'},
  {url:'/services/teen-therapy-denver/',title:'Teen Therapy Denver',desc:'Therapy for teens in Denver and online across Colorado: anxiety, depression, school stress, grief, ADHD and identity. A therapist your teen can talk to.',cat:'Service',tags:'teen teens teenager adolescent high school school anxiety parents kids youth middle'},
  {url:'/services/lgbtq-affirming-therapy-denver/',title:'LGBTQ+ Affirming Therapy Denver',desc:'LGBTQ+ affirming therapy in Denver and online across Colorado for individuals and couples. Identity, coming out, family, relationships and more.',cat:'Service',tags:'lgbtq lgbt gay lesbian bisexual queer trans transgender nonbinary coming out affirming pride'},
  {url:'/services/emotionally-focused-couples-therapy-denver/',title:'Emotionally Focused Couples Therapy (EFT)',desc:'Emotionally Focused Therapy (EFT) for couples across Colorado. Break the pursue-withdraw cycle and rebuild emotional safety. Online sessions statewide.',cat:'Service',tags:'eft emotionally focused therapy couples sue johnson attachment hold me tight pursue withdraw marriage'},
  {url:'/services/pre-marital/',title:'Pre-Marital Counseling Denver',desc:'Build a strong foundation for marriage with evidence-based premarital therapy.',cat:'Service',tags:'premarital pre-marital engaged wedding prepare enrich marriage'},
  {url:'/services/clinical-supervision/',title:'Clinical Supervision Denver',desc:'AAMFT-approved supervision for LPC and LMFT associate therapists in Colorado. Provided by Mark Whitney, ACS.',cat:'Service',tags:'mark whitney clinical supervision acs supervisor lpc lmft associates candidate associate'},
  {url:'/blog/',title:'Mental Health Blog | Full Bloom Counseling',desc:'Insights on anxiety, trauma, Enneagram therapy, disordered eating, and mental health.',cat:'Blog'},
  {url:'/blog/the-root-and-stem/',title:'Introducing The Root and Stem, Full Bloom’s Home for Therapist Trainings and Retreats',desc:'Full Bloom’s new branch for therapists: small trainings, retreats, consultation groups and supervision in Colorado. First retreat: Estes Park, November 2027.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/religious-trauma-faith-deconstruction-therapy-colorado/',title:'Leaving Your Faith, or Halfway Out: Religious Trauma and Faith Deconstruction',desc:'Questioning or leaving religion can bring grief, shame and fear that outlast belief. A Colorado therapist on religious trauma and what helps.',cat:'Blog',author:'Mark Whitney'},
  {url:'/blog/going-home-for-the-holidays-adult-children/',title:'Going Home for the Holidays When Everyone Still Treats You Like You’re 15',desc:'Forty minutes in your parents’ kitchen and you’re a teenager again. A family therapist on why it happens and how to stay yourself at the holidays.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/seasonal-depression-colorado/',title:'300 Days of Sunshine and Still Sad in November',desc:'Colorado is sunny, and winter can still flatten you. A Denver therapist on seasonal depression, the 300-days myth, light boxes, and when to get help.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/miscarriage-grief-therapy-denver/',title:'Nobody Sends Flowers After a Miscarriage',desc:'Miscarriage ends 10 to 20 percent of known pregnancies, and most people grieve it quietly. A Denver perinatal therapist on that grief and when to get support.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/adult-adhd-diagnosis-denver/',title:'Finally Diagnosed With ADHD as an Adult. Now What?',desc:'More than half of adults with ADHD were diagnosed after 18. A Denver therapist on the mix of relief and grief that follows, and what helps next.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/school-anxiety-teens-denver/',title:'When Your Teen Dreads Going Back to School',desc:'Sunday night stomachaches, calls from the nurse, a kid who used to like school. A Denver family therapist on teen school anxiety and what actually helps.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/internal-family-systems-ifs-therapy-denver/',title:'What Is Internal Family Systems (IFS)? Parts Work, Explained in Plain English',desc:'Managers, exiles, firefighters and Self. A Denver therapist who uses IFS daily explains how parts work, what a session looks like, and who it helps.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/people-pleasing-therapy-denver/',title:'You Said Yes Before You Even Decided: Notes for Recovering People Pleasers',desc:'The automatic yes, the guilt after a no, and the resentment in between. A Denver therapist on where people pleasing comes from and what actually helps.',cat:'Blog',author:'Becca Moravec'},
  {url:'/faqs/',title:'Therapy FAQs | Full Bloom Counseling Denver',desc:'Insurance, rates, sliding scale, first sessions, online therapy questions answered.',cat:'FAQ',tags:'faq insurance cost price rates superbill sliding scale'},
  {url:'/contact/',title:'Contact Full Bloom Counseling Denver',desc:'Schedule a free 15-minute consultation. Call 720-767-9808 or email us.',cat:'Contact',tags:'contact book appointment consultation schedule phone email'},
  {url:'/press/',title:'Press & Media | Full Bloom Counseling',desc:'Becca Moravec featured in CNN, Bumble, Jewish Unpacked. Podcast: Two Therapists in Therapy.',cat:'Press'},
  {url:'/boulder/',title:'Boulder Therapy & Counseling',desc:'In-person and online therapy in Boulder for EMDR, trauma, anxiety and young adults with Kelsey Bennett, LPC. Free 15-minute consultation.',cat:'Location',tags:'boulder east boulder arapahoe office location kelsey'},
  {url:'/partnerships/',title:'Community Partnerships',desc:'Full Bloom partners with the Colorado Children\'s Chorale, providing mental health support on every concert tour.',cat:'About',tags:'partnership colorado childrens chorale community'},
  // -- Missing service pages --
  {url:'/services/therapy-for-men-denver/',title:'Therapy for Men in Denver',desc:'A space to work through it. Anxiety, relationships, identity, anger, and the things men rarely say out loud.',cat:'Service',tags:'men mens male anger'},
  {url:'/services/therapy-for-women-denver/',title:'Therapy for Women in Denver',desc:'Individual therapy for anxiety, burnout, body image, relationships, life transitions, and self-discovery.',cat:'Service',tags:'women womens mental load people pleasing'},
  {url:'/services/therapy-young-adults-denver/',title:'Therapy for Young Adults Denver',desc:'Navigating your 20s and early 30s. Identity, relationships, anxiety, career uncertainty, and new independence.',cat:'Service',tags:'young adults 20s 30s college quarter life'},
  {url:'/services/grief-loss-therapy/',title:'Grief & Loss Therapy Denver',desc:'Compassionate support for loss, anticipatory grief, complicated grief, and major life transitions.',cat:'Service',tags:'grief loss bereavement death miscarriage divorce'},
  {url:'/services/adhd-neurodivergent-therapy-denver/',title:'ADHD & Neurodivergent Therapy Denver',desc:'Therapy that works with how your brain actually works. ADHD, autism, sensory processing.',cat:'Service',tags:'adhd add autism neurodivergent executive function'},
  {url:'/services/postpartum-perinatal-therapy/',title:'Postpartum & Perinatal Therapy Denver',desc:'Support for postpartum depression, anxiety, birth trauma, and the emotional complexity of new parenthood.',cat:'Service',tags:'postpartum perinatal pregnancy new mom birth trauma ppd miscarriage'},
  {url:'/services/depression-therapy-denver/',title:'Depression Therapy Denver',desc:'Evidence-based treatment for depression. CBT, EMDR, somatic therapy for real change, not just management.',cat:'Service',tags:'depression sad low mood'},
  {url:'/services/online-therapy-colorado/',title:'Online Therapy Colorado',desc:'All services available via secure telehealth statewide. Denver to Durango, Boulder to Colorado Springs.',cat:'Service',tags:'online telehealth virtual video remote'},
  // -- Blog posts --
  {url:'/blog/family-vacation-stress-family-therapy/',title:'Why Family Vacations Bring Out the Worst in Us (Even the Good Ones)',desc:'Months of planning, and the meltdown still hits by 2 p.m. A Denver family therapist, writing from Disneyland, on why trips get tense and what helps.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/mental-load-women-therapy-denver/',title:'The Mental Load: Why You’re Exhausted When Nothing Is Technically Wrong',desc:'Tracking every appointment, birthday and permission slip is real work. A Denver therapist on the mental load, why rest doesn’t fix it, and what does.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/how-long-does-therapy-take/',title:'How Long Does Therapy Take? A Denver Therapist\'s Honest Answer',desc:'How many sessions until therapy works? Real research ranges, what speeds progress up, and how you\'ll know it\'s working.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/online-therapy-colorado-does-it-work/',title:'Online Therapy in Colorado: Does Virtual Therapy Actually Work?',desc:'Is virtual therapy as effective as in-person? What the research says, who it fits best, and what an online session actually looks like.',cat:'Blog',author:'Jillian Corpora'},
  {url:'/blog/therapy-cherry-creek-glendale-denver/',title:'Therapy in Cherry Creek & Glendale: A Local Guide',desc:'Looking for a therapist near Cherry Creek or Glendale? A local guide to starting therapy in your Denver neighborhood.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/how-much-does-therapy-cost-denver/',title:'How Much Does Therapy Cost in Denver? A Transparent Guide',desc:'Real numbers, no guesswork: what therapy costs in Denver, why rates vary, and how out-of-network benefits can bring the price down.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/does-insurance-cover-therapy-colorado/',title:'Does Insurance Cover Therapy in Colorado? Superbills, Explained',desc:'What out-of-network really means, how superbills work, and the exact questions to ask your insurer before your first session.',cat:'Blog',author:'Becca Moravec'},
    {url:'/blog/teen-therapy-denver/',title:'Teen Therapy in Denver: What Young People Actually Need',desc:'Teen therapy that meets young people where they are, not where adults wish they were. A Denver therapist on what actually helps adolescents.',cat:'Blog',author:'Jillian Corpora'},
  {url:'/blog/depression-therapy-denver/',title:'Depression Therapy in Denver: What It Actually Looks Like',desc:'Depression isn\'t just sadness. A Denver therapist on what depression really is, why it often goes unrecognized, and how therapy helps.',cat:'Blog',author:'Kirsten Adorno'},
  {url:'/blog/somatic-therapy-denver/',title:'Somatic Therapy in Denver: Why Healing Happens in the Body',desc:'Talk therapy doesn\'t work for everyone. A Denver somatic therapist on why body-based therapy reaches what words often can\'t.',cat:'Blog',author:'Natalie Siegel'},
  {url:'/blog/life-transitions-therapy-denver/',title:'Life Transitions Therapy in Denver: When Change Feels Like Too Much',desc:'Divorce, career shifts, loss, empty nest, new city, big changes can feel destabilizing even when chosen. A Denver therapist on how therapy helps.',cat:'Blog',author:'Jillian Corpora'},
  {url:'/blog/attachment-styles-therapy-denver/',title:'Attachment Styles and Therapy in Denver: How Early Bonds Shape Adult Relationships',desc:'Anxious, avoidant, disorganized. Your attachment style shapes every relationship. A Denver therapist explains what it means and how it can change.',cat:'Blog',author:'Kelli Ruhl'},
  {url:'/blog/what-happens-in-your-first-therapy-session/',title:'What Happens in Your First Therapy Session',desc:'Not sure what to expect? A Full Bloom therapist walks you through exactly what happens and why it\'s less scary than you think.',cat:'Blog',author:'Jillian Corpora'},
  {url:'/blog/therapy-for-men-denver/',title:'Therapy for Men: What Gets in the Way (And Why It\'s Worth It)',desc:'Men seek therapy less often and wait longer when they do. A Denver therapist on what actually gets in the way.',cat:'Blog',author:'Mark Whitney'},
  {url:'/blog/enneagram-relationships-communication-denver/',title:'How the Enneagram Can Transform Your Relationships',desc:'Understanding your Enneagram type and your partner\'s can transform how you communicate, fight, and repair.',cat:'Blog',author:'Mark Whitney'},
  {url:'/blog/what-is-complex-ptsd-denver/',title:'What Is Complex PTSD? How It Differs From PTSD',desc:'You didn\'t have one terrible event -- you had years of them. C-PTSD is more common than most people know.',cat:'Blog',author:'Kelli Ruhl'},
  {url:'/blog/intuitive-eating-beginners-guide-denver/',title:'Intuitive Eating: A Beginner\'s Guide From a Denver Therapist',desc:'Intuitive Eating is not about eating whatever you want -- it\'s about rebuilding trust with your body.',cat:'Blog',author:'Jillian Corpora'},
  {url:'/blog/anti-diet-therapy-body-trust/',title:'How to Begin Anti-Diet Therapy: Building Body Trust',desc:'What does it look like to actually let go of the diet mentality? A Full Bloom therapist on how it begins.',cat:'Blog',author:'Natalie Siegel'},
  {url:'/blog/narrative-therapy-couples-families-denver/',title:'Narrative Therapy for Couples and Families',desc:'Every relationship has a story. Narrative therapy helps couples examine the dominant stories keeping them stuck.',cat:'Blog',author:'Kirsten Adorno'},
  {url:'/blog/culturally-responsive-therapy-denver/',title:'Culturally Responsive Therapy: Why Your Culture Belongs in the Room',desc:'Therapy has a history of centering one kind of experience. A Denver therapist on why cultural context matters.',cat:'Blog',author:'Kirsten Adorno'},
  {url:'/blog/safe-sound-protocol-denver/',title:'Feel Safer in Your Body with the Safe and Sound Protocol',desc:'For many people talk therapy isn\'t enough -- especially when anxiety and trauma live in the nervous system.',cat:'Blog',author:'Kelsey Bennett'},
  {url:'/blog/therapy-parents-young-adults-postpartum-colorado/',title:'The Hidden Weight of Parenting',desc:'Postpartum mental health gets attention. The years that follow -- navigating identity, young adults, and more.',cat:'Blog',author:'Kelsey Bennett'},
  {url:'/blog/therapy-for-growth-denver/',title:'Therapy for Growth: Clarity, Connection, and Healing',desc:'Therapy isn\'t just for crisis. A Denver therapist on how counseling can help you grow and find direction.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/the-power-of-pausing/',title:'The Power of Pausing: Why Slowing Down Can Help You Heal',desc:'In a culture that rewards busyness, pausing can feel threatening. But it may be the most healing thing.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/enneagram-therapy-denver/',title:'The Enneagram & Full Bloom: A Long Overdue Website Update',desc:'What the Enneagram actually is, why we use it in therapy, and what this practice stands for.',cat:'Blog',author:'Mark Whitney'},
  {url:'/blog/the-unspoken-truth-about-starting-therapy/',title:'The Unspoken Truth About Starting Therapy',desc:'Most people wait years before reaching out. Here\'s what nobody tells you about what it\'s actually like.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/emdr-therapy-what-to-expect/',title:'EMDR Therapy in Denver: What It Is and What to Expect',desc:'EMDR has become one of the most well-researched treatments available. A Denver therapist explains how it works.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/couples-therapy-denver-gottman-method/',title:'What the Gottman Method Can Teach You About Your Relationship',desc:'The Four Horsemen, emotional bank accounts, and why how you fight matters more than how often.',cat:'Blog',author:'Kelsey Bennett'},
  {url:'/blog/feeling-stuck-in-life-therapy-denver/',title:'When Something Feels Off But You Can\'t Name It',desc:'You don\'t need to be in crisis to deserve support. A Denver therapist on the suffering that doesn\'t have a name.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/therapy-for-men-why-its-different/',title:'Therapy for Men Denver: Why It\'s Different and Why It Works',desc:'Therapy built for men isn\'t softer. It\'s sharper. Mark Whitney on what makes men\'s therapy work differently and what actually changes when it does.',cat:'Blog',author:'Mark Whitney'},
  {url:'/blog/how-to-find-a-therapist-denver/',title:'How to Find the Right Therapist in Denver',desc:'A practical guide to finding a therapist in Denver without the overwhelm: what to search for, what to ask, and how to know when you\'ve found a good fit.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/enneagram-in-therapy-denver/',title:'The Enneagram in Therapy: How Knowing Your Type Changes Everything',desc:'The Enneagram is more than a personality quiz. A certified Denver Enneagram therapist on how it maps core motivations and changes the therapy conversation.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/adhd-therapy-denver/',title:'ADHD Therapy in Denver: When Executive Dysfunction Needs More Than a Planner',desc:'No planner fixes executive dysfunction. A Denver therapist on what ADHD actually looks like in adults and what therapy addresses that coaching can\'t.',cat:'Blog',author:'Jillian Corpora'},
  {url:'/blog/intuitive-eating-therapy-denver/',title:'Intuitive Eating in Therapy: What It Means and Why It Works',desc:'Intuitive eating isn\'t a diet. It\'s a framework for healing your relationship with food. A Denver HAES therapist explains what this work actually involves.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/anxiety-therapy-denver/',title:'Anxiety Therapy Denver: Beyond Managing Symptoms',desc:'Anxiety is more than worry, and therapy does more than teach you to breathe differently. A Denver therapist on what actually changes anxiety.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/trauma-therapy-denver/',title:'Trauma Therapy Denver: What It Is and What to Expect',desc:'Trauma therapy that goes to the root, not just symptom management. EMDR, somatic work, and the Safe and Sound Protocol for PTSD and complex trauma in Denver.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/couples-therapy-denver/',title:'Couples Therapy Denver: How It Works and When to Go',desc:'What couples therapy in Denver actually looks like: how it works, what to expect, and when it makes sense to start. From Full Bloom\'s Gottman-trained therapists.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/grief-therapy-denver/',title:'Grief Therapy Denver: When Grief Needs More Than Time',desc:'Grief doesn\'t follow a timeline, and sometimes it needs more than patience. A Denver therapist on what grief therapy actually addresses.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/postpartum-therapy-denver/',title:'Postpartum Therapy Denver: You Don\'t Have to Do This Alone',desc:'Postpartum depression, anxiety, and overwhelm are more common than people talk about. Denver therapists specializing in postpartum and perinatal care.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/premarital-counseling-denver/',title:'Premarital Counseling Denver: Build It Right',desc:'Premarital counseling isn\'t just for troubled relationships. It\'s for couples who want to start with clarity. Denver Gottman-trained therapists.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/clinical-supervision-denver/',title:'Clinical Supervision Denver: Finding the Right Supervisor',desc:'Finding the right clinical supervisor in Denver is one of the most important decisions new therapists make. What good supervision actually looks like.',cat:'Blog',author:'Becca Moravec'},
  {url:'/blog/how-to-know-if-youre-ready-for-emdr/',title:'How to Know If You\'re Ready for EMDR',desc:'Wondering if EMDR is right for you? Becca Moravec shares the signs you\'re prepared and what to expect from this powerful trauma treatment.',cat:'Blog',author:'Becca Moravec'},
];

/* Search matcher shared by the desktop overlay and the mobile modal.
   Every meaningful word must match somewhere; short words (EFT, IFS, SSP)
   must match a whole word so "eft" doesn't hit "left". Title hits rank first. */
var SEARCH_SOFT = ['therapy','therapist','therapists','counseling','counselor','counselors','denver','colorado','near','me','for','the','a','an','and','in','of','to','with','my','about'];
function searchPages(raw) {
  var q = raw.toLowerCase().replace(/[^a-z0-9+&' -]/g, ' ').trim();
  if (!q) return [];
  var words = q.split(/\s+/).filter(Boolean);
  var hard = words.filter(function(w) { return SEARCH_SOFT.indexOf(w) === -1; });
  if (!hard.length) {
    hard = words.filter(function(w) { return /^(therap|counsel)/.test(w); }).slice(0, 1);
    if (!hard.length) hard = words;
  }
  function has(text, w) {
    if (!text) return false;
    text = text.toLowerCase();
    if (w.length <= 3) {
      var esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp('(^|[^a-z0-9])' + esc + '([^a-z0-9]|$)').test(text);
    }
    return text.indexOf(w) !== -1;
  }
  var scored = [];
  PAGES.forEach(function(p) {
    var score = 0;
    for (var i = 0; i < hard.length; i++) {
      var w = hard[i], s = 0;
      if (has(p.title, w)) s = 4;
      else if (has(p.tags, w)) s = 3;
      else if (has(p.author, w) || has(p.cat, w)) s = 2;
      else if (has(p.desc, w) || has(p.url.replace(/[-/]/g, ' '), w)) s = 1;
      if (!s) return;
      score += s;
    }
    if (p.title.toLowerCase().indexOf(q) !== -1) score += 5;
    if (p.cat === 'Service' || p.cat === 'Therapist') score += 1;
    scored.push({ p: p, s: score });
  });
  scored.sort(function(a, b) { return b.s - a.s; });
  return scored.map(function(x) { return x.p; });
}

function doSearch() {
  if (!searchInput) return;
  var q = searchInput.value.toLowerCase().trim();
  var results = document.getElementById('search-results');
  if (!results) return;
  if (!q) { results.innerHTML = ''; return; }

  var hits = searchPages(q);

  if (hits.length === 0) {
    results.innerHTML = '<p class="search-no-results">No results found for \u201c' + q + '\u201d. Try a different search.</p>';
    return;
  }

  results.innerHTML = hits.map(function(p) {
    var authorStr = p.author ? ' <span style="opacity:.65;">by ' + p.author + '</span>' : '';
    return '<a href="' + ROOT_PATH.replace(/\/$/, '') + p.url + '" class="search-result-item">' +
      '<div class="search-result-cat">' + p.cat + authorStr + '</div>' +
      '<h4>' + p.title + '</h4>' +
      '<p>' + p.desc + '</p>' +
      '</a>';
  }).join('');
}

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-question').forEach(function(q) {
  q.addEventListener('click', function() {
    var item = q.closest('.faq-item'), was = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(el) {
      el.classList.remove('open');
      el.querySelector('.faq-question').setAttribute('aria-expanded','false');
    });
    if (!was) { item.classList.add('open'); q.setAttribute('aria-expanded','true'); }
  });
});

/* ── Contact form ── */
var form = document.getElementById('contact-form'), suc = document.getElementById('form-success');

  /* Set page load timestamp for time-check spam filter */
  var ltField = document.getElementById('_loadtime');
  if (ltField) ltField.value = Date.now();

if (form && suc) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    /* ── CHECKBOX VALIDATION ──────────────────────────────────────────
       e.preventDefault() bypasses native required validation, so we
       check the private pay checkbox manually before anything else.  */
    var cb = document.getElementById('private_pay_confirm');
    if (cb && !cb.checked) {
      cb.focus();
      cb.closest('.form-group') && cb.closest('.form-group').scrollIntoView({behavior:'smooth', block:'center'});
      /* Visual shake on the checkbox container */
      var wrap = cb.closest('div[style]') || cb.parentElement;
      if (wrap) {
        wrap.style.outline = '2px solid var(--petal-dark)';
        wrap.style.borderRadius = '8px';
        setTimeout(function(){ wrap.style.outline = ''; }, 2000);
      }
      return;
    }

    /* ── SPAM LAYER 1: Time check ─────────────────────────────────────
       Bots submit instantly. Real users take at least 3 seconds to read
       and fill out a form. Reject anything under 3 seconds.         */
    var loadTime = parseInt(document.getElementById('_loadtime').value || '0', 10);
    var elapsed = Date.now() - loadTime;
    if (elapsed < 3000) {
      /* Silent fail — bot gets no feedback */
      form.hidden = true;
      suc.hidden = false;
      return;
    }

    /* ── SPAM LAYER 2: Honeypot check ─────────────────────────────────
       Three hidden fields with tempting names. Bots fill them in.
       Real users never see them (display:none + tabindex:-1).        */
    var hp1 = document.getElementById('_hp_website').value;
    var hp2 = document.getElementById('_hp_phone').value;
    var hp3 = document.getElementById('_hp_company').value;
    if (hp1 || hp2 || hp3) {
      /* Silent fail */
      form.hidden = true;
      suc.hidden = false;
      return;
    }

    /* ── SPAM LAYER 3: Duplicate submit guard ─────────────────────────
       Prevent the same session from submitting twice.               */
    if (sessionStorage.getItem('fbc_submitted')) {
      form.hidden = true;
      suc.hidden = false;
      return;
    }

    /* ── Real submission ─────────────────────────────────────────────── */
    /* Build clean subject: "New Inquiry — Jane Smith (Couples Therapy)" */
    var fname = (form.querySelector('[name="First Name"]') || {}).value || '';
    var lname = (form.querySelector('[name="Last Name"]') || {}).value || '';
    var service = (form.querySelector('[name="Interested In"]') || {}).value || '';
    var clientEmail = (form.querySelector('[name="Email Address"]') || {}).value || '';
    var fullName = (fname + ' ' + lname).trim();
    var subjectField = document.getElementById('form-subject');
    var replytoField = document.getElementById('form-replyto');
    if (subjectField) {
      subjectField.value = 'New Inquiry: ' + fullName + (service ? ' (' + service + ')' : '');
    }
    if (replytoField && clientEmail) {
      replytoField.value = clientEmail;
    }
    var b = form.querySelector('[type="submit\"]');
    if (b) { b.disabled = true; b.textContent = 'Sending…'; }
    fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}})
      .then(function(r) {
        if (r.ok) {
          sessionStorage.setItem('fbc_submitted', '1');
          form.hidden = true;
          suc.hidden = false;
          suc.focus();
        } else {
          alert('Something went wrong. Please call 720-767-9808.');
        }
      })
      .catch(function() { alert('Connection error. Please call 720-767-9808 or email info@fullbloomcounseling.com.'); })
      .finally(function() { if (b) { b.disabled = false; b.textContent = 'Send Message'; } });
  });}

/* ── Active nav link ── */
var path = location.pathname;
document.querySelectorAll('.nav-link').forEach(function(a) {
  var href = a.getAttribute('href');
  if (!href) return;
  if (href === '/' && (path === '/' || path === '/index.html')) a.classList.add('active');
  else if (href !== '/' && path.indexOf(href) === 0) a.classList.add('active');
});

/* ── Fade-in on scroll ── */
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, {threshold:0.08, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade-in').forEach(function(el) { obs.observe(el); });
/* Safety net: if IO hasn't fired within 1.5s (slow first load / no support), show everything */
setTimeout(function() {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(function(el) { el.classList.add('visible'); });
}, 1500);

/* ── Hero entrance: start the fade/slide on the FIRST PAINTED FRAME ──
   Why this exists: if the entrance animation is declared in static CSS on
   .hero-content, its clock starts at render-tree construction — before the
   first paint. On a slow first (uncached) load, the browser spends time before
   painting, so the animation runs during that invisible gap and is finished by
   the time the page appears — it looks like the hero "just popped in." (On a
   reload the paint is fast, so you see it play; that's the reported symptom.)
   Fix: CSS keeps the hero hidden with a 1.6s failsafe reveal, and we add .play
   inside requestAnimationFrame so the animation is anchored to a frame the
   visitor actually sees. Double rAF guarantees a paint has happened first. */
(function() {
  function playHero() {
    document.querySelectorAll('.hero-content').forEach(function(hc) { hc.classList.add('play'); });
  }
  function armHero() { requestAnimationFrame(function() { requestAnimationFrame(playHero); }); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', armHero);
  } else {
    armHero();
  }
  /* Replay on bfcache restore (Back/Forward): the page returns already-finished,
     so reset and play again. */
  window.addEventListener('pageshow', function(e) {
    if (!e.persisted) return;
    document.querySelectorAll('.hero-content').forEach(function(hc) {
      hc.classList.remove('play'); void hc.offsetWidth; hc.classList.add('play');
    });
  });
})();

/* ── Mobile search modal ── */
(function() {
  var mSearchBtn = document.getElementById('mobile-search-btn');
  var mSearchInput = document.getElementById('mobile-search-input');
  if (!mSearchBtn || !mSearchInput) return;

  // Build dedicated mobile search modal
  var modal = document.createElement('div');
  modal.id = 'mobile-search-modal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-label','Search');
  modal.setAttribute('aria-modal','true');
  modal.innerHTML =
    '<div class="msm-box">' +
      '<div class="msm-top">' +
        '<input type="search" id="msm-input" class="msm-input" placeholder="Search therapists, services, topics\u2026" autocomplete="off" aria-label="Search site">' +
        '<button class="msm-close" id="msm-close" aria-label="Close search">' +
          '<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>' +
        '</button>' +
      '</div>' +
      '<button class="msm-submit" id="msm-submit">Search</button>' +
      '<div class="msm-results" id="msm-results" role="list" aria-live="polite"></div>' +
    '</div>';
  document.body.appendChild(modal);

  var msmInput = document.getElementById('msm-input');
  var msmResults = document.getElementById('msm-results');

  function openMobileSearch() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { if (msmInput) msmInput.focus(); }, 80);
    // Pre-fill with whatever's already typed in the bottom bar
    if (mSearchInput.value) { msmInput.value = mSearchInput.value; runMobileSearch(); }
  }
  function closeMobileSearch() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    msmResults.innerHTML = '';
    msmInput.value = '';
  }
  function runMobileSearch() {
    var q = msmInput.value.toLowerCase().trim();
    if (!q) { msmResults.innerHTML = ''; return; }
    var hits = searchPages(q);
    if (!hits.length) {
      msmResults.innerHTML = '<p class="msm-no-results">No results for \u201c' + q + '\u201d</p>';
      return;
    }
    msmResults.innerHTML = hits.map(function(p) {
      var authorLabel = p.author ? ' · ' + p.author : '';
      return '<a href="' + ROOT_PATH.replace(/\/$/, '') + p.url + '" class="msm-result">' +
        '<span class="msm-cat">' + p.cat + authorLabel + '</span>' +
        '<strong>' + p.title + '</strong>' +
        '<span>' + p.desc + '</span></a>';
    }).join('');
  }

  mSearchBtn.addEventListener('click', openMobileSearch);
  /* Also open + search if user presses Enter in the nav bar input */
  if (mSearchInput) {
    mSearchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { openMobileSearch(); }
    });
  }
  document.getElementById('msm-close').addEventListener('click', closeMobileSearch);
  document.getElementById('msm-submit').addEventListener('click', runMobileSearch);
  msmInput.addEventListener('input', runMobileSearch);
  msmInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') runMobileSearch();
    if (e.key === 'Escape') closeMobileSearch();
  });
  modal.addEventListener('click', function(e) { if (e.target === modal) closeMobileSearch(); });
})();

/* ══════════════════════════════════════════════
   KONAMI CODE EASTER EGG
   ↑ ↑ ↓ ↓ ← → ← → B A  (then Enter/Start)
   ══════════════════════════════════════════════ */
(function() {
  var CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var pos = 0;

  // Build the retro TV overlay; the screen runs BLOOM (js/bloom.js, loaded on demand)
  var overlay = document.createElement('div');
  overlay.id = 'konami-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Bloom, a hidden game');
  overlay.innerHTML =
    '<div class="kt">' +
      '<div class="kt-screen"><canvas class="konami-game" width="240" height="190" aria-label="Bloom game"></canvas><div class="kt-glass"></div></div>' +
      '<picture><source srcset="/images/tv-set-700.webp 700w, /images/tv-set.webp 994w" sizes="(max-width: 750px) 92vw, 720px" type="image/webp"><img class="kt-set" src="/images/tv-set.png" alt="" width="994" height="683"></picture>' +
      '<span class="kt-lcd" aria-hidden="true">BLOOM</span>' +
      '<button class="kt-knob" type="button" aria-label="New round"><picture><source srcset="/images/tv-knob.webp" type="image/webp"><img src="/images/tv-knob.png" alt="" width="74" height="74"></picture></button>' +
    '</div>' +
    '<button type="button" class="konami-close">Close &#10005;</button>' +
    '<p class="konami-hint">You found the secret garden. Turn the dial for a new round.</p>';
  document.body.appendChild(overlay);
  var canvas = overlay.querySelector('canvas'), loaded = false;

  function showKonami() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    function go() { if (window.FBBloom) window.FBBloom.start(canvas); }
    if (loaded) return go();
    var sc = document.createElement('script');
    sc.src = '/js/bloom.js?v=3'; sc.onload = function() { loaded = true; go(); };
    document.head.appendChild(sc);
  }
  function hideKonami() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (window.FBBloom) window.FBBloom.stop();
    pos = 0;
  }

  document.addEventListener('keydown', function(e) {
    if (overlay.classList.contains('active')) { if (e.key === 'Escape') hideKonami(); return; }
    if (e.key === CODE[pos]) {
      pos++;
      if (pos === CODE.length) { showKonami(); pos = 0; }
    } else {
      pos = (e.key === CODE[0]) ? 1 : 0;
    }
  });

  overlay.querySelector('.konami-close').addEventListener('click', hideKonami);
  var knob = overlay.querySelector('.kt-knob'), lcd = overlay.querySelector('.kt-lcd'), turns = 0, lcdT = null;
  knob.addEventListener('click', function() {
    turns++; knob.style.setProperty('--rot', (20 + turns * 45) + 'deg');
    if (window.FBBloom) window.FBBloom.restart();
  });
  setInterval(function() {
    if (!overlay.classList.contains('active') || !window.FBBloom) return;
    var g = window.FBBloom.score(); if (!g) return;
    lcd.textContent = g.state === 'play' ? ('\u273F ' + String(g.s).padStart(2, '0')) : 'BLOOM';
  }, 250);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) hideKonami(); });

  // Same code on touch screens: swipe up, up, down, down, left, right, left, right, then tap twice
  var tx = 0, ty = 0, tt = 0;
  function feed(key) {
    if (overlay.classList.contains('active')) return;
    if (key === CODE[pos]) { pos++; if (pos === CODE.length) { showKonami(); pos = 0; } }
    else { pos = (key === CODE[0]) ? 1 : 0; }
  }
  document.addEventListener('touchstart', function(e) { var t = e.changedTouches[0]; tx = t.clientX; ty = t.clientY; tt = Date.now(); }, { passive: true });
  document.addEventListener('touchend', function(e) {
    var t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Date.now() - tt > 600) return;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) {
      // taps only count once the eight swipes are in
      if (pos >= 8) feed(pos === 8 ? 'b' : 'a');
      return;
    }
    feed(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft') : (dy > 0 ? 'ArrowDown' : 'ArrowUp'));
  }, { passive: true });
})();

/* ══════════════════════════════════════════════
   TAKE A BREATH: box breathing, 4 in, 4 hold, 4 out, 4 hold
   Opened by any [data-breathe] link
   ══════════════════════════════════════════════ */
(function() {
  var triggers = document.querySelectorAll('[data-breathe]');
  if (!triggers.length) return;
  /* Built on first open, not at page load. A hidden full-screen layer that
     exists from load can flash on iOS Safari during a refresh (its Close box
     and ring showed behind the hamburger). */
  var ov = null, cue = null, count = null;
  function build() {
    ov = document.createElement('div');
    ov.className = 'breathe';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'A one-minute breathing exercise');
    ov.innerHTML =
      '<button class="breathe-close" type="button" aria-label="Close">Close &#10005;</button>' +
      '<div class="breathe-stage"><div class="breathe-ring"></div><div class="breathe-dot"></div>' +
      '<p class="breathe-cue" aria-live="polite">Get comfortable</p><p class="breathe-count"></p></div>' +
      '<p class="breathe-foot">Box breathing: in for four, hold for four, out for four, hold for four.<br>Stay as long as you like.</p>';
    document.body.appendChild(ov);
    cue = ov.querySelector('.breathe-cue'); count = ov.querySelector('.breathe-count');
    ov.querySelector('.breathe-close').addEventListener('click', close);
    void ov.offsetWidth; /* commit the hidden state so the first open still fades in */
  }
  var steps = [['Breathe in', 'in'], ['Hold', 'hold-in'], ['Breathe out', 'out'], ['Hold', 'hold-out']];
  var timer = null, last = null;
  function run() {
    var i = 0, n = 4;
    function tick() {
      if (n === 4) { cue.textContent = steps[i][0]; ov.setAttribute('data-phase', steps[i][1]); }
      count.textContent = n;
      n--;
      if (n === 0) { n = 4; i = (i + 1) % 4; }
    }
    cue.textContent = 'Get comfortable'; count.textContent = '';
    ov.setAttribute('data-phase', 'rest');
    timer = setTimeout(function() { tick(); timer = setInterval(tick, 1000); }, 1500);
  }
  function open(e) { if (e) e.preventDefault(); if (!ov) build(); last = document.activeElement; ov.classList.add('active'); document.body.style.overflow = 'hidden'; ov.querySelector('.breathe-close').focus(); run(); }
  function close() { if (!ov) return; ov.classList.remove('active'); document.body.style.overflow = ''; clearTimeout(timer); clearInterval(timer); if (last) last.focus(); }
  triggers.forEach(function(t) { t.addEventListener('click', open); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && ov && ov.classList.contains('active')) close(); });
})();

/* ══════════════════════════════════════════════
   SEASONAL DRIFT: homepage only, once per visit, a few pieces for ~10 seconds.
   Spring petals (Apr 1 to May 31), fall aspen leaves (Sep 20 to Nov 10),
   winter snow (Dec 15 to Jan 5). Nothing the rest of the year.
   Preview any season with ?season=spring|fall|winter.
   SEASONAL_ON switches the automatic run on or off. While it is false,
   visitors see nothing, but the ?season= preview still works.
   ══════════════════════════════════════════════ */
(function() {
  var SEASONAL_ON = false; // off until Becca signs off
  if (!/^\/(index\.html)?$/.test(location.pathname)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var forced = (location.search.match(/[?&]season=(spring|fall|winter)/) || [])[1];
  if (!SEASONAL_ON && !forced) return;
  var d = new Date(), md = (d.getMonth() + 1) * 100 + d.getDate();
  var season = forced || (md >= 401 && md <= 531 ? 'spring' : md >= 920 && md <= 1110 ? 'fall' : (md >= 1215 || md <= 105) ? 'winter' : null);
  if (!season) return;
  try { if (!forced && sessionStorage.getItem('fbc-season')) return; sessionStorage.setItem('fbc-season', '1'); } catch (e) {}
  var SHAPES = {
    spring: ['<svg viewBox="0 0 20 20"><path d="M10 1C14 5 15 11 10 19 5 11 6 5 10 1z" fill="#F2C9B0"/><path d="M10 3v14" stroke="#E8B898" stroke-width=".8"/></svg>',
             '<svg viewBox="0 0 20 20"><path d="M10 2C15 6 15 12 10 18 5 12 5 6 10 2z" fill="#F6E3C6"/></svg>'],
    fall:   ['<svg viewBox="0 0 20 24"><path d="M10 1C16 4 18 11 10 19 2 11 4 4 10 1z" fill="#E6B04B"/><path d="M10 4v19" stroke="#A8724E" stroke-width="1"/></svg>',
             '<svg viewBox="0 0 20 24"><path d="M10 1C16 4 18 11 10 19 2 11 4 4 10 1z" fill="#D9963A"/><path d="M10 4v19" stroke="#8B5E3A" stroke-width="1"/></svg>'],
    winter: ['<svg viewBox="0 0 20 20"><g stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"><path d="M10 2v16M3 6l14 8M17 6L3 14"/></g></svg>',
             '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="4" fill="#FFFFFF"/></svg>']
  };
  setTimeout(function() {
    var box = document.createElement('div');
    box.className = 'season-drift'; box.setAttribute('aria-hidden', 'true');
    var n = window.innerWidth < 700 ? 6 : 10, longest = 0;
    for (var i = 0; i < n; i++) {
      var el = document.createElement('span'), size = 12 + Math.random() * 10, dur = 7 + Math.random() * 5, delay = Math.random() * 3;
      longest = Math.max(longest, dur + delay);
      el.innerHTML = SHAPES[season][i % 2];
      el.style.cssText = 'left:' + (Math.random() * 100) + 'vw;width:' + size + 'px;height:' + size + 'px;opacity:' + (season === 'winter' ? .75 : .6) +
        ';animation-duration:' + dur + 's;animation-delay:' + delay + 's;--dx:' + ((Math.random() - .5) * 160) + 'px;--rot:' + ((Math.random() - .5) * 540) + 'deg';
      el.firstChild.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
      box.appendChild(el);
    }
    document.body.appendChild(box);
    setTimeout(function() { box.style.opacity = '0'; setTimeout(function() { box.remove(); }, 1600); }, longest * 1000);
  }, 1200);
})();

/* Hello, fellow developer: a small business card in the console */
try {
  (function() {
    if (window.__fbcSig) return; window.__fbcSig = true;
    /* Console styles can't set a width, so the card is set in a monospace face
       and every band is padded to the same character count. Same size, same
       tracking, same side padding: the bands and rules end at the same edge in
       any console font, with no measuring. */
    var MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
    var SANS = 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';
    var word = 'F U L L   B L O O M   C O U N S E L I N G';
    var hi = 'Hi, I’m Chad. I designed and built this site.';
    var N = Math.max(word.length, hi.length);
    function pad(t) { while (t.length < N) t += ' '; return t; }
    var parts = [], styles = [];
    function add(text, style) { parts.push('%c' + text); styles.push(style || ''); }
    var band = 'display: inline-block; font-family: ' + MONO + '; font-size: 13px; letter-spacing: 0; padding: 0 20px; border-left: 4px solid ';

    add(pad(word), band + '#A8724E; background: #2E241C; color: #F8F4EE; font-weight: 700; line-height: 46px;'); add('\n');
    add(pad(hi), band + '#C8967A; background: #3D3127; color: #EADBC8; font-weight: 400; line-height: 36px;'); add('\n');

    var rule = 'display: inline-block; font-family: ' + MONO + '; letter-spacing: 0; padding: 0 20px 0 24px; font-weight: 400; line-height: 0; font-size: 13px; color: transparent; border-top: 1px solid #A8724E; margin: 16px 0 12px;';
    function hr() { add(pad(''), rule); add('\n'); }
    var tag = 'font: 700 10px ' + SANS + '; letter-spacing: 2.5px; color: #F8F4EE; background: #A8724E; padding: 5px 10px; line-height: 2.2;';
    var desc = 'font: 400 12px ' + SANS + '; color: #9A8670; line-height: 2;';
    var strong = 'font: 600 13px ' + SANS + '; color: #A8724E; line-height: 2;';

    hr();
    add('THERAPISTWEB.DESIGN', tag); add('\n');
    add('Websites for therapists and group practices', desc); add('\n');
    add(' ', 'font-size: 6px; line-height: 1;'); add('\n');
    add('STUDIONULL.IO', tag); add('\n');
    add('A small Denver studio: brand, web design and development', desc); add('\n');
    hr();
    add('hello@therapistweb.design', strong); add('    ', strong); add('(720) 466-1013', strong); add('\n');
    add('https://therapistweb.design/    https://studionull.io/', desc); add('\n');
    add(' ', 'font-size: 8px; line-height: 1;'); add('\n');
    add('Psst. There’s a secret garden on this site:', 'font: 500 12px ' + SANS + '; color: #A8724E; line-height: 2;'); add('\n');
    var key = 'display: inline-block; font: 700 11px ' + SANS + '; color: #2E241C; background: #F8F4EE; border: 1px solid #C8967A; border-bottom-width: 3px; border-radius: 2px; padding: 3px 7px; margin: 4px 5px 0 0; line-height: 1.2;';
    ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'].forEach(function(k) { add(k, key); });
    console.log.apply(console, [parts.join('')].concat(styles));
  })();
} catch (e) {}

})();

// Fix: ensure 4-item grids are always 2-column
(function() {
  document.querySelectorAll('.svc-benefit-grid').forEach(function(grid) {
    var cards = grid.querySelectorAll('.svc-benefit-card');
    if (cards.length === 4 && !grid.classList.contains('svc-benefit-grid-2col')) {
      grid.classList.add('svc-benefit-grid-2col');
    }
  });
})();



// Testimonial carousel — single card
document.querySelectorAll('.svc-testimonials').forEach(function(wrap) {
  var viewport = wrap.querySelector('.testimonial-viewport');
  var track = wrap.querySelector('.testimonial-track');
  var cards = wrap.querySelectorAll('.testimonial-card');
  var dots = wrap.querySelectorAll('.testimonial-dot');
  var prevBtn = wrap.querySelector('.t-prev');
  var nextBtn = wrap.querySelector('.t-next');
  if (!track || !cards.length) return;
  var current = 0;
  var total = cards.length;
  var isAnimating = false;

  function goTo(n) {
    if (isAnimating) return;
    isAnimating = true;
    current = ((n % total) + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
    setTimeout(function() { isAnimating = false; }, 460);
  }

  dots.forEach(function(d, i) { d.addEventListener('click', function() { goTo(i); }); });
  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });

  // Touch swipe
  var touchX = 0;
  track.addEventListener('touchstart', function(e) { touchX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', function(e) {
    var diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  }, {passive:true});

  // Auto-advance every 6s
  var timer = setInterval(function() { goTo(current + 1); }, 6000);
  wrap.addEventListener('mouseenter', function() { clearInterval(timer); });
  wrap.addEventListener('mouseleave', function() { timer = setInterval(function() { goTo(current + 1); }, 6000); });

  goTo(0);
});


/* ── Bot protection: load timestamp only (full anti-spam in primary handler above) ──
   NOTE: A second submit listener here caused a race condition silently blocking
   real submissions on certain browsers. Removed duplicate — do not re-add. */
(function() {
  var tsField = document.getElementById('form-timestamp');
  if (tsField) tsField.value = Date.now();
})();


/* ── Sidebar sticky across multi-section pages ── */
(function() {
  var sidebar = document.querySelector('.svc-sidebar');
  if (!sidebar) return;
  // Only activate if sidebar is NOT already in a single-section page
  var sectionsInMain = document.querySelectorAll('#main section');
  if (sectionsInMain.length <= 1) return;

  var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 88;
  var offset = navH + 24;
  var sidebarW = sidebar.offsetWidth;

  function updateSidebar() {
    var lastSection = sectionsInMain[sectionsInMain.length - 1];
    var lastBottom = lastSection.getBoundingClientRect().bottom + window.scrollY;
    var sidebarBottom = sidebar.getBoundingClientRect().bottom + window.scrollY;
    var scrollY = window.scrollY;

    // Get the top of the first section
    var firstTop = sectionsInMain[0].getBoundingClientRect().top + window.scrollY;

    if (scrollY + offset < firstTop) return; // above content

    var maxTop = lastBottom - sidebar.offsetHeight - window.scrollY;
    var desiredTop = scrollY + offset - firstTop;
    var clampedTop = Math.min(desiredTop, maxTop);

    sidebar.style.transform = 'translateY(' + Math.max(0, clampedTop) + 'px)';
    sidebar.style.position = 'relative';
    sidebar.style.top = '0';
  }

  // Only run on pages with multiple sections
  sidebar.style.willChange = 'transform';
  window.addEventListener('scroll', updateSidebar, { passive: true });
  updateSidebar();
})();

/* ── Logo click: always scroll to top on homepage ── */
(function() {
  var logo = document.querySelector('.nav-logo a');
  if (!logo) return;
  logo.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    var isHome = window.location.pathname === '/' || 
                 window.location.pathname === '/index.html' ||
                 window.location.pathname.endsWith('/fbc-update/');
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', window.location.pathname);
    }
  });
  /* logo-scroll-top */
})();


/* Post share buttons: native share sheet on phones, copy-link everywhere */
(function(){
  document.querySelectorAll('.post-share').forEach(function(box){
    var url = box.getAttribute('data-share-url'), title = box.getAttribute('data-share-title');
    var nativeBtn = box.querySelector('.post-share-native'), copyBtn = box.querySelector('.post-share-copy');
    if (navigator.share && nativeBtn) {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', function(){ navigator.share({title: title, url: url}).catch(function(){}); });
    }
    if (copyBtn) copyBtn.addEventListener('click', function(){
      var done = function(){ copyBtn.textContent = 'Link copied'; setTimeout(function(){ copyBtn.textContent = 'Copy link'; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function(){});
      else { var t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch(e){} document.body.removeChild(t); }
    });
  });
})();

/* ── Lead tracking (GA4) ───────────────────────────────────────────────────
   Sends events so Analytics shows actual inquiries, not just visits:
   generate_lead  contact form sent (fires when the success message appears)
   phone_click    tap on the phone number
   email_click    tap on the email address
   consult_click  any button or link to the contact page
   portal_click   existing clients opening the client portal            */
(function(){
  function send(name, params){
    try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch(e){}
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var where = { link_text: (a.textContent || '').trim().slice(0, 60), page_path: location.pathname };
    if (href.indexOf('tel:') === 0) send('phone_click', where);
    else if (href.indexOf('mailto:') === 0) { if (!a.closest('.post-share')) send('email_click', where); }
    else if (/clientsecure\.me/.test(href)) send('portal_click', where);
    else if (/(^|\/)contact\/?$/.test(href.replace(location.origin, '')) && location.pathname.indexOf('/contact') !== 0) send('consult_click', where);
  }, true);
  var suc = document.getElementById('form-success');
  if (suc && 'MutationObserver' in window) {
    var fired = false;
    new MutationObserver(function(){
      if (!fired && !suc.hidden) {
        fired = true;
        var svc = document.querySelector('#contact-form-ejs select, #contact-form select');
        send('generate_lead', { form: 'contact', service: svc ? svc.value : '' });
      }
    }).observe(suc, { attributes: true, attributeFilter: ['hidden'] });
  }
})();

/* ── Blog index: topic filters + show more ──────────────────────────────
   Every post stays in the HTML (good for search); visitors see 12 at a time. */
(function() {
  if (!/\/blog\/?(index\.html)?$/.test(location.pathname)) return;
  var cards = Array.prototype.slice.call(document.querySelectorAll('main .blog-card'));
  if (cards.length < 13) return;
  var grid = cards[0].parentNode, PAGE = 12, shown = PAGE, active = 'all';
  var TOPICS = [
    ['all', 'All posts', /./],
    ['relationships', 'Relationships', /COUPLE|FAMIL|RELATIONSHIP|MARRI|ATTACHMENT|PARENT/],
    ['trauma', 'Trauma', /TRAUMA|PTSD|EMDR|SOMATIC|SAFE AND SOUND|SAFE & SOUND/],
    ['anxiety', 'Anxiety & mood', /ANXIETY|DEPRESS|BURNOUT|PANIC|SAD IN|SELF-CARE|PEOPLE PLEAS/],
    ['body', 'Food & body', /HEALTH AT EVERY|BODY|EATING|HAES|DIET/],
    ['grief', 'Grief & loss', /GRIEF|LOSS|MISCARRIAGE/],
    ['growth', 'Identity & growth', /GROWTH|DISCOVERY|WOMEN|\bMEN\b|ENNEAGRAM|POSTPARTUM|QUARTER|STUCK|TRANSITION|ADHD|TEEN|FAITH/],
    ['start', 'Starting therapy', /THERAPY PROCESS|THERAPY APPROACH|FIRST|COST|INSURANCE|FIND A THERAPIST|HOW LONG|ONLINE THERAPY|STARTING|SUPERVISION/]
  ];
  cards.forEach(function(c) {
    var cat = ((c.querySelector('.blog-card-cat') || {}).textContent || '') + ' ' + ((c.querySelector('.blog-card-title') || {}).textContent || '');
    cat = cat.toUpperCase();
    c.dataset.topics = TOPICS.filter(function(t) { return t[2].test(cat); }).map(function(t) { return t[0]; }).join(' ');
  });
  var bar = document.createElement('div');
  bar.className = 'blog-filters';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Filter posts by topic');
  TOPICS.forEach(function(t) {
    var n = cards.filter(function(c) { return c.dataset.topics.indexOf(t[0]) > -1; }).length;
    if (!n) return;
    var b = document.createElement('button');
    b.type = 'button'; b.dataset.topic = t[0];
    b.innerHTML = t[1] + ' <span>' + n + '</span>';
    b.setAttribute('aria-pressed', t[0] === 'all' ? 'true' : 'false');
    bar.appendChild(b);
  });
  grid.parentNode.insertBefore(bar, grid);
  var more = document.createElement('div');
  more.className = 'blog-more';
  more.innerHTML = '<button type="button" class="btn btn-outline"></button><p aria-live="polite"></p>';
  grid.parentNode.insertBefore(more, grid.nextSibling);
  var moreBtn = more.querySelector('button'), status = more.querySelector('p');
  function render() {
    var match = cards.filter(function(c) { return c.dataset.topics.indexOf(active) > -1; });
    cards.forEach(function(c) { c.hidden = true; });
    match.forEach(function(c, i) { c.hidden = i >= shown; if (!c.hidden) c.classList.add('visible', 'in-view', 'is-visible'); });
    var left = match.length - Math.min(shown, match.length);
    moreBtn.hidden = left <= 0;
    moreBtn.textContent = 'Show ' + Math.min(left, PAGE) + ' more';
    status.textContent = 'Showing ' + Math.min(shown, match.length) + ' of ' + match.length + ' posts';
  }
  bar.addEventListener('click', function(e) {
    var b = e.target.closest('button'); if (!b) return;
    active = b.dataset.topic; shown = PAGE;
    bar.querySelectorAll('button').forEach(function(x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    render();
  });
  moreBtn.addEventListener('click', function() {
    var firstNew = cards.filter(function(c) { return c.dataset.topics.indexOf(active) > -1; })[shown];
    shown += PAGE; render();
    if (firstNew) { var a = firstNew.querySelector('a'); if (a) a.focus({ preventScroll: true }); }
  });
  render();
})();

/* Logo bloom: a few flowers in the F open up in color on hover */
(function () {
  var links = document.querySelectorAll('.nav-logo a');
  if (!links.length) return;
  var base = (document.querySelector('.nav-logo img') || {}).getAttribute ? document.querySelector('.nav-logo img').getAttribute('src').replace(/fbc-logo-f-white\.png.*$/, '') : '';
  var F = [['daisy', 44.34, 14.65, 22.27], ['roseR', 75.98, 25.20, 9.77], ['topR', 62.70, 16.99, 8.40], ['roseL', 28.71, 24.02, 9.77], ['mid', 36.91, 40.04, 12.11], ['roseLL', 25.39, 48.83, 9.38]];
  links.forEach(function (a) {
    var img = a.querySelector('img');
    if (!img || a.querySelector('.nl-wrap')) return;
    var wrap = document.createElement('span');
    wrap.className = 'nl-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    F.forEach(function (f, i) {
      var s = document.createElement('span');
      s.className = 'nl-f';
      s.setAttribute('aria-hidden', 'true');
      s.style.cssText = 'left:' + f[1] + '%;top:' + f[2] + '%;width:' + f[3] + '%;--d:' + (i * 70) + 'ms;background-image:url(' + base + 'logo-bloom-' + f[0] + '.png)';
      wrap.appendChild(s);
    });
  });
})();

/* Skip link only for real keyboard users (not after DevTools or a click) */
(function () {
  var root = document.documentElement;
  document.addEventListener('keydown', function (e) { if (e.key === 'Tab') root.classList.add('kb-nav'); });
  document.addEventListener('pointerdown', function () { root.classList.remove('kb-nav'); });
})();
