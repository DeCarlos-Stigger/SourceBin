export const state = () => ({
  key: undefined,
  content: '',
  languageId: undefined,

  saved: false,
});

export const mutations = {
  reset(s) {
    Object.assign(s, state());
  },
  updateContent(state, content) {
    state.content = content;

    state.key = undefined;
    state.saved = false;
  },
  setLanguageId(state, languageId) {
    state.languageId = languageId;
  },
  loadFromKeySuccess(state, bin) {
    state.key = bin.key;
    state.content = bin.content;
    state.languageId = bin.languageId;

    state.saved = true;
  },
  loadFromQuerySuccess(state, external) {
    state.key = external.src;
    state.content = external.content;

    state.saved = true;
  },
  saveSuccess(state, key) {
    state.key = key;

    state.saved = true;
  },
};

export const actions = {
  async loadFromKey({ commit }, key) {
    const bin = await this.$axios.$get(`/api/bins/${key}`);

    commit('loadFromKeySuccess', bin);
  },
  async loadFromQuery({ commit }, query) {
    const content = await this.$axios.$get('/proxy', {
      params: {
        q: query.src,
      },
    });

    commit('loadFromQuerySuccess', {
      src: query.src,
      content,
    });
  },
  async save({ commit, state }) {
    const res = await this.$axios.$post('/api/bins', {
      content: state.content,
      languageId: state.languageId,
    });

    commit('saveSuccess', res.key);
  },
};
