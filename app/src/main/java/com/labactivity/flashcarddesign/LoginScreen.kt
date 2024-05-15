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
import com.labactivity.flashcarddesign.databinding.LoginScreenBinding

class LoginScreen : AppCompatActivity() {
    private lateinit var binding:LoginScreenBinding
    private lateinit var auth: FirebaseAuth


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = LoginScreenBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.signUpTxt.setOnClickListener(){
            val intent = Intent(this,SignIn::class.java)
            startActivity(intent)
            this.finish()
        }

        binding.LoginBtn.setOnClickListener {
            val emailInput = binding.emailEditText.text.toString()
            val passwordInput = binding.PasswordTxt.text.toString()
            val progressBar = binding.progressBar
            auth = Firebase.auth

            progressBar.visibility = View.VISIBLE

            if (TextUtils.isEmpty(emailInput) || TextUtils.isEmpty(passwordInput)) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                progressBar.visibility = View.GONE
                return@setOnClickListener
            }

            auth.signInWithEmailAndPassword(emailInput, passwordInput)
                .addOnCompleteListener(this) { task ->
                    progressBar.visibility = View.GONE
                    if (task.isSuccessful) {
                        Toast.makeText(
                            this,
                            "Login successful.",
                            Toast.LENGTH_SHORT
                        ).show()

                        val intent = Intent(this, HomeScreen::class.java)
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