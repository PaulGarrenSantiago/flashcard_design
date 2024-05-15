package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

object NavigationHandler {
    fun handleNavigation(activity: AppCompatActivity, bottomNavigationView: BottomNavigationView, itemId: Int) {
        bottomNavigationView.menu.findItem(itemId)?.isChecked = true // Highlight the pressed item

        when (itemId) {
            R.id.action_home -> {
                if (activity !is HomeScreen) {
                    activity.startActivity(Intent(activity, HomeScreen::class.java))
                    activity.finish()
                }
            }
            R.id.action_category -> {
                if (activity !is Categories) {
                    activity.startActivity(Intent(activity, Categories::class.java))
                    activity.finish()
                }
            }
            R.id.action_create -> {
                if (activity !is Terms) {
                    activity.startActivity(Intent(activity, Terms::class.java))
                    activity.finish()
                }
            }
            R.id.action_flashcards -> {
                if (activity !is Terms) {
                    activity.startActivity(Intent(activity, MyFlashcards::class.java))
                    activity.finish()
                }
            }
            // Add other cases for remaining menu items if needed
        }
    }
}
