package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.labactivity.flashcarddesign.databinding.HomescreenBinding

class HomeScreen : AppCompatActivity() {
    private lateinit var binding:HomescreenBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = HomescreenBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.bottomNavigation.setOnNavigationItemSelectedListener { item ->
            NavigationHandler.handleNavigation(this, binding.bottomNavigation, item.itemId)
            true
        }
    }
}