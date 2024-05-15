package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.auth
import com.labactivity.flashcarddesign.databinding.ActivityProfileBinding

class Profile : AppCompatActivity() {
    private lateinit var binding:ActivityProfileBinding
    private lateinit var auth: FirebaseAuth
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)
        auth = Firebase.auth

        binding.bottomNavigation.setOnNavigationItemSelectedListener { item ->
            NavigationHandler.handleNavigation(this, binding.bottomNavigation, item.itemId)
            true
        }

        binding.logoutBtn.setOnClickListener(){
            Firebase.auth.signOut()
            val intent = Intent(this, LoginScreen::class.java)
            startActivity(intent)
            finish()
        }

    }
}