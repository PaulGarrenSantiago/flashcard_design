package com.labactivity.flashcarddesign

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.TextUtils
import android.view.View
import android.widget.Toast
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.auth
import com.labactivity.flashcarddesign.databinding.SignInBinding

class SignIn : AppCompatActivity() {
    private lateinit var binding:SignInBinding
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = SignInBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.SignUpBtn.setOnClickListener {
            val usernameInput = binding.usernameTxt.text.toString()
            val emailInput = binding.EmailAddTxt.text.toString() // Use text property instead of toString()
            val passwordInput = binding.PasswordTxt.text.toString() // Use text property instead of toString()
            val progressBar = binding.progressBar
            auth = Firebase.auth

            progressBar.visibility = View.VISIBLE

            if (TextUtils.isEmpty(emailInput) || TextUtils.isEmpty(passwordInput) || TextUtils.isEmpty(usernameInput)) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                progressBar.visibility = View.GONE
                return@setOnClickListener
            }

            auth.createUserWithEmailAndPassword(emailInput, passwordInput)
                .addOnCompleteListener(this) { task ->
                    progressBar.visibility = View.GONE
                    if (task.isSuccessful) {
                        Toast.makeText(
                            this,
                            "Successfully Registered.",
                            Toast.LENGTH_SHORT
                        ).show()
                        val intent = Intent(this, AboutUs::class.java)
                        startActivity(intent)
                        finish()
                    } else {
                        // If sign in fails, display a message to the user.
                        Toast.makeText(
                            this,
                            "Authentication failed: ${task.exception?.message}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
        }

    }
}