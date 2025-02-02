import { defineStore } from "pinia";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { format, differenceInDays } from "date-fns";
export const useHabitStore = defineStore("habitStore", {
  state: () => ({
    habits: [],
  }),
  actions: {
    //fetch habits from server
    async fetchHabits() {
      const { $db } = useNuxtApp();
      const snapshot = await getDocs(collection($db, "habits"));
      this.habits = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    //add habit
    async addHabit(name) {
      const { $db } = useNuxtApp();
      const habit = {
        name,
        completions: [],
        streak: 0,
      };
      const docRef = await addDoc(collection($db, "habits"), habit);
      this.habits.push({ id: docRef.id, ...habit });
    },
    //delete habit
    async deleteHabit(id) {
      const { $db } = useNuxtApp();
      const docRef = doc($db, "habits", id);
      await deleteDoc(docRef);
      this.habits = this.habits.filter((habit) => habit.id !== id);
    },
    //update habit
    async updateHabit(id, updates) {
      const { $db } = useNuxtApp();
      const docRef = doc($db, "habits", id);
      await updateDoc(docRef, updates);
      const index = this.habits.findIndex((habit) => habit.id === id);
      if (index !== -1) {
        this.habits[index] = { ...this.habits[index], ...updates };
      }
    },
    // completing a daily habit
    toggleCompletion(habit) {
      const today = format(new Date(), "yyyy-mm-dd");
      if (habit.completions.includes(today)) {
        habit.completions = habit.completions.filter((date) => date !== today);
      } else {
        habit.completions.push(today);
      }

      habit.streak = this.calculateSteak(habit.completions);

      this.updateHabit(habit.id, {
        completions: habit.completions,
        streak: habit.streak,
      });
    },
    // calculate habit streak
    calculateSteak(completions) {
      const sortedDates = completions.sort((a, b) => new Date(a) - new Date(b));
      let streak = 0;
      let today = new Date();

      for (const date of sortedDates) {
        const diff = differenceInDays(today, new Date(date));

        if (diff > 1) {
          break;
        }

        streak += 1;
        today = new Date(date);
      }
      return streak;
    },
  },
});
